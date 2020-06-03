import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { ProposalsService } from '../_services/proposals.service';
import { FormBuilder } from '@angular/forms';
import { AuthService, UserService } from '../_services';
import { User } from '../_models';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs/internal/Subscription';
import * as io from 'socket.io-client';
import { GroupService } from '../_services/group.service';
import { EmployeeService } from '../_services/employee.service';
import { FileExplorerService } from '../_services/file-explorer.service';
import { ActivityService } from '../_services/activity.service';
import { NodemailService } from '../_services/nodemail.service';
import * as $ from "jquery"

const UploadURL = 'http://localhost:4000/file/uploadFile';

@Component({
	selector: 'app-proposals-profile',
	templateUrl: './proposals-profile.component.html',
	styleUrls: ['./proposals-profile.component.scss']
})
export class ProposalsProfileComponent implements OnInit {
	private userSubscription: Subscription[] = [];
	proposal_id: string = "";
	subs$;
	proposal_members = [];
	proposal_file: any;
	proposal_profile = [];
	proposal_comment = [];
	proposal_groupName: any;
	proposalFileForm: any;
	currentUser: any;
	uploadFile: any;
	fileToUpload = false;
	fileName: any;
	fileSize: any;
	Proposal_have_attachment = true;
	ifProposalHaveComment = true;
	ifProposalHaveDecision = true;
	proposalComment: any;
	proposal_approve_reject: any;
	proposal_decisions = [];
	update_proposal_approve: any;
	update_proposal_reject: any;
	update_proposal_status: any;
	proposal_approves = [];
	proposal_rejects = [];
	panel1: any;
	panel1_photo: any;
	panel2: any;
	panel2_photo: any;
	panel3: any;
	panel3_photo: any;
	adviser: any;
	adviser_photo: any;
	ifUserIsStudent: any;
	approveBTN: boolean = true;
	rejectBTN: boolean = true;
	deleteCommentId: any;
	//-----For Realtime--------------
	socket;
	url = 'http://localhost:4000';
	editCommentId: any;
	editCommentForm: any;
	checkProposalCommentIfExisting: boolean;
	//-----For Realtime--------------	

	constructor(private route: ActivatedRoute,
		private api: ApiService,
		private proposalService: ProposalsService,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private userService: UserService,
		private groupService: GroupService,
		private employeeService: EmployeeService,
		private fileExplorerService: FileExplorerService,
		private activityService: ActivityService,
		private nodemailService: NodemailService) {
		//-----For Realtime--------------
		this.socket = io(this.url);
		this.userSubscription.push(
			this.proposalService
				.getApproveReject()
				.subscribe(() => {
					this.getProposalApproveReject();
					this.updateApproveRejectOnOpen();
				})
		);
		this.userSubscription.push(
			this.proposalService
				.getProposalCommentData()
				.subscribe(() => {
					this.getProposalComment();
				})
		);
		//-----For Realtime--------------
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		if (this.currentUser.role == 'Student') {
			this.ifUserIsStudent = false;
		} else { this.ifUserIsStudent = true; }
		this.uploadFile = new FileUploader({
			url: UploadURL, itemAlias: 'files', headers:
				[
					{ name: 'year', value: `${this.currentUser.year}` },
					{ name: 'section', value: `${this.currentUser.section}` },
					{ name: 'group_name', value: `${this.currentUser.group_proposal_name}` },
					{ name: 'subject', value: 'proposals' }
				]
		});
	}

	ngOnInit() {
		this.subs$ = this.route
			.queryParams
			.subscribe((params) => {
				this.proposal_id = params["name"];
			});
		this.getProposalMembers();
		this.getProposalProfile();
		this.getProposalFile();
		this.getProposalComment();
		this.getProposalApproveReject();
		this.updateApproveRejectOnOpen();
		this.getProposalPanelist();
		this.getProposalAdviser();
		this.checkProposalCommentIfExistingForCommittee();

		this.update_proposal_approve = this.formBuilder.group({
			approve: ['']
		});

		this.update_proposal_reject = this.formBuilder.group({
			reject: ['']
		});

		this.update_proposal_status = this.formBuilder.group({
			status: ['']
		});

		this.proposal_approve_reject = this.formBuilder.group({
			proposal_id: [''],
			first_name: [''],
			last_name: [''],
			user_id: [''],
			decision: [''],
			title: [''],
			avatar_path: [''],
			avatar_photo: ['']
		});


		this.proposalComment = this.formBuilder.group({
			proposal_id: [''],
			committee_id: [''],
			comment: [''],
			decision: ['']
		});

		this.proposalFileForm = this.formBuilder.group({
			proposal_id: [''],
			file_path: [''],
			file_name: [''],
			folder_parent: ['']
		});

		this.editCommentForm = this.formBuilder.group({
			comment: [''],
		});

		this.uploadFile.onAfterAddingFile = (file) => {
			file.withCredentials = false;
			this.fileToUpload = true;
			this.fileName = file['file']['name'];
			this.api.formatBytes(file['file']['size'], 2).subscribe(
				data => {
					this.fileSize = data;
				}
			)
			// console.log(file['file']['size'])
		};
		this.uploadFile.onProgressItem = (progress: any) => {
			// console.log(progress['progress']);
		};
		this.uploadFile.onCompleteItem = (file, item: any, response: any, status: any, headers: { any }) => {
			// console.log('FileUpload:uploaded:', item, status, response, headers);
		};
	}

	createProposalApproveReject(decision) {
		this.proposal_approve_reject.value.proposal_id = this.proposal_id;
		this.proposal_approve_reject.value.first_name = this.currentUser.firstName;
		this.proposal_approve_reject.value.last_name = this.currentUser.lastName;
		this.proposal_approve_reject.value.user_id = this.currentUser._id;
		this.proposal_approve_reject.value.decision = decision;
		this.proposal_approve_reject.value.title = this.currentUser.title;
		this.proposal_approve_reject.value.avatar_path = this.currentUser.avatar_path;
		this.proposal_approve_reject.value.avatar_photo = this.currentUser.avatar_photo;
		// var proposal_approve_reject = {proposal_approve_reject: [this.proposal_approve_reject.value]};
		this.proposalService.createProposalApproveReject(this.proposal_id, this.currentUser._id, this.proposal_approve_reject.value).subscribe(
			data => {
				// console.log(data);

			}
		)
	}

	updateProposalApproveReject(decision) {
		var changeDecision = { decision: `${decision}` };
		// var proposal_approve_reject = {proposal_approve_reject: [this.proposal_approve_reject.value]};
		this.proposalService.updateProposalDecision(this.proposal_id, changeDecision).subscribe(
			data => {
				// console.log(data);
			}
		);
	}

	changeDecision(){
		this.checkProposalCommentIfExisting = !this.checkProposalCommentIfExisting;
	}

	checkProposalCommentIfExistingForCommittee(){
		this.proposalService.checkProposalCommentIfExisting(this.proposal_id, this.currentUser._id).subscribe(
			data => {
				if(data.length == 0){
					this.checkProposalCommentIfExisting = true;
				} else {
					this.checkProposalCommentIfExisting = false;
					if(data[0].decision == 'approve'){
						this.approveBTN = false;
						this.rejectBTN = true;
					} else {
						this.approveBTN = true;
						this.rejectBTN = false;
					}
				}
			}
		);
	}

	createProposalComment(decision) {
		this.proposalComment.value.proposal_id = this.proposal_id;
		this.proposalComment.value.committee_id = this.currentUser._id;
		this.proposalComment.value.decision = decision;
		console.log(this.proposalComment.value)
		this.proposalService.checkProposalCommentIfExisting(this.proposalComment.value.proposal_id, this.proposalComment.value.committee_id).subscribe(
			data => {
				// console.log("niel", data)
				if (data.length == 0) {
					this.proposalService.createProposalComment(this.proposalComment.value).subscribe(
						data => {
							this.nodemailService.mailDecision(this.currentUser.firstName, this.currentUser.lastName, this.proposalComment.value.decision, this.proposalComment.value.comment, this.proposalComment.value.proposal_id).subscribe();
							this.updateApproveRejectOnOpen();
							this.getProposalApproveReject();
							$("#closeBtn").trigger("click");
						}
					);
				} else {
					this.proposalService.updateProposalComment(this.proposalComment.value.proposal_id, this.proposalComment.value.committee_id, this.proposalComment.value).subscribe(
						data => {
							this.updateApproveRejectOnOpen();
							this.getProposalApproveReject();
							this.changeDecision();
						}
					);
				}
			}
		);
	}

	createProposal() {
		this.userService.getById(this.currentUser._id).subscribe(
			data => {
				var data_data: any;
				data_data = data;
				this.proposalFileForm.value.proposal_id = this.proposal_id;
				this.proposalFileForm.value.file_name = this.fileName;
				this.groupService.getById(data_data.group_proposal_id).subscribe(
					data => {
						this.proposalFileForm.value.folder_parent = data.groupName;
						this.proposalFileForm.value.file_path = `assets/_fileStorage/section${this.currentUser.year}-${this.currentUser.section}/proposals/${data.groupName}/`;
						// bukas kailangan gumawa ng folder dito yung folder_name at folder_parent
					},
					error => { console.log(error) },
					() => {
						this.proposalService.createProposalFile(this.proposalFileForm.value).subscribe(
							data => {
								var counter = 0;
								this.uploadFile.uploadAll();
								let activity = ({ 
									notification_users: [this.currentUser._id],
									user_id: `${this.currentUser._id}`,
									section:	`${this.currentUser.section}`,
									year:	`${this.currentUser.year}`,
									batch_year:	`${this.currentUser.created_batch_year}`,
									batch_sem:	`${this.currentUser.created_batch_sem}`,
									message: 'uploaded a file',
									file_name: `${this.fileName}`,
									group_id: `${this.currentUser.group_proposal_id}`
								});
								this.activityService.create(activity).subscribe(
									data=> {
			
									}
								);

								this.fileExplorerService.getFolders().subscribe(
									data => {
										for (let i = 0; i < data.length; i++) {
											if (data[i].folder_name == this.proposalFileForm.value.folder_parent) {
												counter++;
											}
										}
									},
									error => { console.log(error) },
									() => {
										if (counter == 0) {
											var folder = {
												folder_name: `${this.proposalFileForm.value.folder_parent}`,
												folder_parent: 'proposals'
											}
											this.fileExplorerService.create(folder).subscribe(
												data => {
													// console.log("sample folder", data);
												}
											)
										}
									}
								)
							}
						);
					}
				)
			},
			error => { console.log(error) },
			() => {
				// this.proposalService.createProposalFile(this.proposalFileForm.value).subscribe(
				// 	data => {
				// 		this.uploadFile.uploadAll();
				// 		// console.log(data)
				// 	}
				// )
			}
		);
	}

	viewPdf(path, file_name) {
		console.log(path, file_name)
		window.open(path + file_name, '_blank');
	}

	getProposalApproveReject() {
		let array = [];
		this.proposalService.getProposalApproveReject(this.proposal_id).subscribe(
			data => {
				if (data.length != 0) {
					this.ifProposalHaveDecision = false;
				}
				// this.proposal_decisions = data;
				for (let i = 0; i < data.length; i++) {
					this.employeeService.getById(data[i].committee_id).subscribe(
						committee => {
							let object = Object.assign(committee, data[i]);
							array.push(object);
						}
					);
				}
				for (let i = 0; i < data.length; i++) {
					if (data[i].decision == 'approve') {
						this.proposal_approves.push(data[i].decision);
					}
					else {
						this.proposal_rejects.push(data[i].decision);
					}
				}
			}, error => { console.log(error) },
			() => {
				//Complete
				this.proposal_decisions = array;
				if (this.proposal_approves.length >= 0 && this.proposal_approves.length <= 6 || this.proposal_rejects.length >= 0 && this.proposal_rejects.length <= 3) {
					this.update_proposal_status.value.status = 'Pending';
					// this.proposalService.update(this.proposal_id, this.update_proposal_status.value).subscribe(
					// 	data => { }
					// );
				}
				if (this.proposal_approves.length >= 7 && this.proposal_rejects.length <= 3) {
					this.update_proposal_status.value.status = 'Approved';
					this.proposalService.update(this.proposal_id, this.update_proposal_status.value).subscribe(
						data => { }
					);
					this.nodemailService.approvedProposal(this.proposal_id).subscribe();
				}
				if (this.proposal_approves.length >= 0 && this.proposal_rejects.length >= 4) {
					this.update_proposal_status.value.status = 'Rejected';
					// this.proposalService.update(this.proposal_id, this.update_proposal_status.value).subscribe(
					// 	data => { }
					// );
				}
			}
		);
	}

	getProposalComment() {
		let array = [];
		this.proposalService.getProposalComment(this.proposal_id).subscribe(
			data => {
				if (data.length != 0) {
					this.ifProposalHaveComment = false;
				}
				for (let i = 0; i < data.length; i++) {
					this.employeeService.getById(data[i].committee_id).subscribe(
						committee => {
							let object = Object.assign(committee, data[i]);
							array.push(object);
						}
					);
				}
			}, error => {

			}, () => {
				this.proposal_comment = array;
				// console.log(this.proposal_comment)
			}
		)
	}

	getProposalFile() {
		this.proposalService.getProposalFile(this.proposal_id).subscribe(
			data => {
				// console.log(data)
				if (data.length != 0) {
					this.Proposal_have_attachment = false;
				}
				this.proposal_file = data;
			}
		)
	}

	getProposalProfile() {
		this.proposalService.getById(this.proposal_id).subscribe(
			data => {
				this.proposal_profile = data;
				this.groupService.getById(data.group_id).subscribe(
					data => {
						// console.log(data)
						this.proposal_groupName = data.groupName;
					}
				)
			}
		)
	}

	getProposalPanelist() {
		this.proposalService.getById(this.proposal_id).subscribe(
			data => {
				this.groupService.getById(data.group_id).subscribe(
					data => {
						// console.log(data)
						if (data.panel1 != "N/A") {
							this.employeeService.getById(data.panel1).subscribe(
								data => {
									// console.log(data)
									let panel: any;
									panel = data;
									this.panel1_photo = panel.avatar_path + panel.avatar_photo;
									this.panel1 = panel.title + panel.whole_name;
								}
							)
						} else {
							this.panel1_photo = 'assets/img/Avatars/unknown_avatar.png';
							this.panel1 = 'N/A';
						}
						if (data.panel2 != "N/A") {
							this.employeeService.getById(data.panel2).subscribe(
								data => {
									// console.log(data)
									let panel: any;
									panel = data;
									this.panel2_photo = panel.avatar_path + panel.avatar_photo;
									this.panel2 = panel.title + panel.whole_name;
								}
							)
						} else {
							this.panel2_photo = 'assets/img/Avatars/unknown_avatar.png';
							this.panel2 = 'N/A';
						}
						if (data.panel3 != "N/A") {
							this.employeeService.getById(data.panel3).subscribe(
								data => {
									// console.log(data)
									let panel: any;
									panel = data;
									this.panel3_photo = panel.avatar_path + panel.avatar_photo;
									this.panel3 = panel.title + panel.whole_name;
								}
							)
						} else {
							this.panel3_photo = 'assets/img/Avatars/unknown_avatar.png';
							this.panel3 = 'N/A';
						}
					}
				)
			}
		)
	}

	getProposalMembers() {
		this.api.getProposalMembers(this.proposal_id).subscribe(
			data => {
				// console.log(data)
				// this.proposal_members = data;
				for (let i = 0; i < data.length; i++) {
					this.api.getAvatar(data[i]._id).subscribe(
						data => {
							// console.log(data);
							this.proposal_members.push(data)
						}
					)
				}
			}
		)
	}

	getProposalAdviser() {
		this.proposalService.getById(this.proposal_id).subscribe(
			data => {
				this.api.getSectionAdviser(data.year, data.section).subscribe(
					data => {
						// console.log(data)
						if (data[0].adviser_id != 'N/A') {
							this.employeeService.getById(data[0].adviser_id).subscribe(
								data => {
									// console.log(data)
									let adviserData: any;
									adviserData = data;
									this.adviser_photo = adviserData.avatar_path + adviserData.avatar_photo;
									this.adviser = adviserData.title + ' ' + adviserData.whole_name;
								}
							)
						} else {
							this.adviser_photo = 'assets/img/Avatars/unknown_avatar.png';
							this.adviser = 'N/A';
						}
					}
				)
			}
		)
	}

	updateApproveRejectOnOpen() {
		this.proposalService.getProposalApproveCount(this.proposal_id).subscribe(
			data => {
				console.log("lols",this.proposal_id);
				// if(data.length >= 0 && data.length <= 6){
				// 	this.update_proposal_status.value.status = 'Pending';
				// 	this.proposalService.update(this.proposal_id, this.update_proposal_status.value).subscribe(
				// 		data=>{}
				// 	)
				// }
				// else if(data.length > 6){
				// 	this.update_proposal_status.value.status = 'Approved';
				// 	this.proposalService.update(this.proposal_id, this.update_proposal_status.value).subscribe(
				// 		data=>{}
				// 	)
				// }
				this.update_proposal_approve.value.approve = data.length;
				this.proposalService.update(this.proposal_id, this.update_proposal_approve.value).subscribe(
					data => { }
				)
			}
		);
		this.proposalService.getProposalRejectCount(this.proposal_id).subscribe(
			data => {
				// console.log(data.length);
				// if(data.length >= 0 && data.length <= 3){
				// 	this.update_proposal_status.value.status = 'Pending';
				// 	this.proposalService.update(this.proposal_id, this.update_proposal_status.value).subscribe(
				// 		data=>{}
				// 	)
				// }
				// else if(data.length > 3){
				// 	this.update_proposal_status.value.status = 'Rejected';
				// 	this.proposalService.update(this.proposal_id, this.update_proposal_status.value).subscribe(
				// 		data=>{}
				// 	)
				// }
				this.update_proposal_reject.value.reject = data.length;
				this.proposalService.update(this.proposal_id, this.update_proposal_reject.value).subscribe(
					data => {
					}
				)
			}
		);
	}

	openModalDeleteComment(id) {
		this.deleteCommentId = id
		document.getElementById("openModalDeleteComment").click();
	}

	deleteComment() {
		console.log(this.deleteCommentId)
		this.proposalService.deleteComment(this.deleteCommentId).subscribe(
			data => {
				console.log("success delete");
			});
	}

	openModaleditCommentOrDecision(id) {
		this.editCommentId = id
		document.getElementById("openModaleditCommentOrDecision").click();
	}

	editComment() {
		console.log(this.editCommentId)
		console.log('form', this.editCommentForm.value);
		this.proposalService.updateComment(this.editCommentId, this.editCommentForm.value).subscribe(
			data => {
				console.log("success edit");
			});
	}

	ngOnDestroy() {
		if (this.subs$) {
			this.subs$.unsubscribe();
		}
		this.userSubscription.forEach(Subscription => Subscription.unsubscribe());
	}

}
