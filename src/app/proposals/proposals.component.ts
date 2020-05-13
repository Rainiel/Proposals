import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService, AuthService } from '../_services';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../_models';
import { GroupService } from '../_services/group.service';
import { ApiService } from '../_services/api.service';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';
import {  } from 'ng2-file-upload/ng2-file-upload';
import { ProposalsService } from '../_services/proposals.service';
import { Router } from '@angular/router';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import * as io from 'socket.io-client';
import { ActivityService } from '../_services/activity.service';
declare var $: any;

const UploadURL = 'http://localhost:4000/file/uploadFile';


@Component({
	selector: 'app-proposals',
	templateUrl: './proposals.component.html',
	styleUrls: ['./proposals.component.scss']
})
export class ProposalsComponent implements OnInit {
	// @ViewChild('closeModalWhenCreateGroup', {static: false}) private closeModal: ElementRef;
	private userSubscription: Subscription[] = [];
	users: Array<any>;
	groupForm: any;
	selectedMember: any;
	currentUser: User;
	alertMembers = false;
	groupMembersLimit;
	update_status: any;
	proposalForm: any;
	proposals = [];
	userHaveGroup: any;
	disabled = false;
	ShowFilter = true;
	limitSelection = true;
	selectedItems = [];
	dropdownSettings: any = {};
	fileToUpload = false;
	fileName: any;
	fileSize: any;
	section_list = [];
	proposal_table_column = [];
	uploadFile: any;
	errorMessage: any;
	dataTable: any;
	userGroupName: any;
	proposalFileForm: any;
	isUserStudent = false;
	ifSameProposal = false;
	sameProposals = [];
	//-----For Realtime--------------
	socket;
	url = 'http://localhost:4000';
	//-----For Realtime--------------

	constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private groupService: GroupService,
		private api: ApiService,
		private proposalService: ProposalsService,
		private changeDetectorRef: ChangeDetectorRef,
		private router: Router,
		private activityService: ActivityService) {
		//-----For Realtime--------------
		this.authService.currentUser.subscribe(x => this.currentUser = x);
		this.socket = io(this.url);
		if (this.currentUser.role == 'Student') {
			this.isUserStudent = false;
		}
		else {
			this.isUserStudent = true;
		}
		// this.userSubscription.push(
		// 	this.proposalService
		// 		.getProposals()
		// 		.subscribe(() => {

		// 			if (this.currentUser.role == 'Student') {
		// 				console.log('group id', this.currentUser.group_proposal_id);
		// 				this.getOwnProposal();
		// 			} else {
		// 				console.log('group Id', this.currentUser.group_proposal_id);
		// 				this.getAllProposals();
		// 			}
		// 		})
		// );
		//-----For Realtime--------------

		this.getUserWithoutGroup();
		this.getLoaded();
		this.api.checkIfUserHaveGroup().subscribe(
			data => {
				this.userHaveGroup = data;
			}
		)
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
		$(document).ready(function () {
			$("#save_proposal_title").click(function () {
				$(".odd").children(".dataTables_empty").remove();
			});
		});

		this.dropdownSettings = {
			singleSelection: false,
			idField: '_id',
			textField: 'whole_name',
			avatar_pathField: 'avatar_path',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 4,
			limitSelection: this.limitSelection,
			allowSearchFilter: this.ShowFilter
		};
		this.selectedItems = [{ _id: this.currentUser._id, whole_name: this.currentUser.whole_name }];

		this.groupForm = this.formBuilder.group({
			groupName: [''],
			groupType: [''],
			year: [''],
			section: [''],
			groupMembers: [this.selectedItems],
			subject: ['Design_Project'],
			panel1: ['N/A'],
			panel2: ['N/A'],
			panel3: ['N/A']
		});

		this.update_status = this.formBuilder.group({
			group_proposal_id: ['']
		});

		this.proposalForm = this.formBuilder.group({
			group_id: [''],
			year: [this.currentUser.year],
			section: [this.currentUser.section],
			title: [''],
			approve: ['0'],
			reject: ['0'],
			status: ['New']
		});

		this.proposalFileForm = this.formBuilder.group({
			proposal_id: [''],
			file_path: [''],
			file_name: ['']
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
			console.log(file['file']['size'])
		};
		this.uploadFile.onProgressItem = (progress: any) => {
			console.log(progress['progress']);
		};
		this.uploadFile.onCompleteItem = (file, item: any, response: any, status: any, headers: { any }) => {
			console.log('FileUpload:uploaded:', item, status, response, headers);
			// console.log(file['file']['name'])
		};
	}

	getUserWithoutGroup() {
		this.userSubscription.push(
			this.userService.getUserWithoutGroup(this.currentUser.section, this.currentUser.year)
				.pipe(first()).subscribe(
					users => {
						this.users = users;
					})
		);
	}

	viewProposal(id) {
		this.router.navigate(['/proposal-profile'], { queryParams: { name: id } });
	}

	getLoaded() {
		this.api.getSectionList().subscribe(
			data => {
				this.section_list = data;
				// console.log(data)
			}
		);
		this.api.getProposalTableColumn().subscribe(
			data => {
				this.proposal_table_column = data;
				// console.log(data)
				if (this.isUserStudent == false) {
					this.getOwnProposal();
				} else {
					this.getAllProposals();
				}
			}
		)
	}

	getAllProposals() {
		this.proposalService.getProposal().subscribe(
			data => {
				this.proposals = data;
				console.log(data)
			},
			error => { this.errorMessage = <any>error },
			() => {
				//Complete
				this.changeDetectorRef.detectChanges();
				var table = $("#proposals_table").DataTable();
				// this.dataTable = table.DataTable();
				$('#section_list').on('change', function () {
					table.column(2).search(this.value).draw();
				});
			}
		)
	}

	getOwnProposal() {
		this.proposalService.getOwnProposal(this.currentUser.group_proposal_id).subscribe(
			data => {
				console.log(data)
				this.proposals = data;
			},
			error => { this.errorMessage = <any>error },
			() => {
				//Complete
				this.changeDetectorRef.detectChanges();
				var table = $("#proposals_table").on("draw.dt", function () {
					$(this).find(".dataTables_empty").parents('tbody').empty();
				}).DataTable();
				// this.dataTable = table.DataTable();
				$('#section_list').on('change', function () {
					table.column(2).search(this.value).draw();
				});
			}
		)
	}

	createGroup() {
		this.groupForm.value.year = this.currentUser.year;
		this.groupForm.value.section = this.currentUser.section;
		this.groupService.createGroup(this.groupForm.value)
			.pipe(first())
			.subscribe(
				data => {
					this.update_status.value.group_proposal_id = data._id;
					this.api.createGroup(this.groupForm.value.groupMembers, this.update_status.value)
					let activity = ({ 
						notification_users: [this.currentUser._id],
						user_id: `${this.currentUser._id}`,
						section:	`${this.currentUser.section}`,
						year:	`${this.currentUser.year}`,
						batch_year:	`${this.currentUser.created_batch_year}`,
						batch_sem:	`${this.currentUser.created_batch_sem}`,
						message: 'created a group',
						link: `group-profile`,
						group_name: `${this.groupForm.value.groupName}`,
						group_members: this.groupForm.value.groupMembers
					});
					this.activityService.create(activity).subscribe(
						data=> {

						}
					);

				},
				error => { console.log(error) },
				() => {
					window.location.reload();
				}
			);
	}

	createProposal() {
		var counter = 0;
		this.userService.getById(this.currentUser._id).subscribe(
			data => {
				var data_data: any;
				data_data = data;
				if (data_data.group_proposal_id) {
					this.proposalForm.value.section = this.currentUser.section;
					this.proposalForm.value.group_id = data_data.group_proposal_id;
					// ------------------------
					// console.log("finish")
					// console.log(this.proposalForm.value)
					let creatingProposal = this.proposalForm.value.title.split(" ");
					for (let i = 0; i < this.proposals.length; i++) {
						let splitted = this.proposals[i].title.split(" ");
						console.log("splitted", splitted);
						for (let j = 0; j < splitted.length; j++) {
							for (let k = 0; k < creatingProposal.length; k++) {
								if (splitted[j].toLowerCase().replace(/s$|1$|2$|3$|4$|5$|6$|7$|8$|9$|0$/, "") == creatingProposal[k].toLowerCase().replace(/s$|1$|2$|3$|4$|5$|6$|7$|8$|9$|0$/, "")) {
									this.ifSameProposal = true;
									counter = 1;
									console.log("Possible same thesis", this.proposals[i]);
									this.sameProposals.push(this.proposals[i]);
								}
							}
						}
					}
					//-------------------------
				}
				else {
					console.log("di nag e exist");
				}
			},
			error => { this.errorMessage = <any>error },
			() => {
				if (counter == 0) {
					this.proposalService.createProposal(this.proposalForm.value).subscribe(
						data => {
							let activity = ({ 
								notification_users: [this.currentUser._id],
								user_id: `${this.currentUser._id}`,
								section:	`${this.currentUser.section}`,
								year:	`${this.currentUser.year}`,
								batch_year:	`${this.currentUser.created_batch_year}`,
								batch_sem:	`${this.currentUser.created_batch_sem}`,
								message: 'created a proposal',
								proposal_title: `${this.proposalForm.value.title}`
							});
							this.activityService.create(activity).subscribe(
								data=> {

								}
							);
						}
					);
				}
			}
		);
	}

	onItemSelect(item: any) {
	}

	onItemDeSelect(item: any) {
		this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: this.groupMembersLimit });
		if (this.groupMembersLimit == 2 && this.groupForm.value.groupMembers.length <= 2) {
			this.alertMembers = false;
		}
	}

	toogleShowFilter() {
		this.ShowFilter = !this.ShowFilter;
		this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
	}

	handleLimitSelection(num) {
		this.groupMembersLimit = num;
		console.log(num)
		if (num == 2 && this.groupForm.value.groupMembers.length > 2) {
			this.alertMembers = true;
			console.log(this.groupForm.value.groupMembers)
		}
		else if (num == 4 && this.groupForm.value.groupMembers.length > 2) {
			this.alertMembers = false;
		}
		else if (this.limitSelection) {
			this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: num });
		} else {
			this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
		}
	}

	ngOnDestroy() {
		this.userSubscription.forEach(Subscription => Subscription.unsubscribe());
	}

}
