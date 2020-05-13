import { Component, OnInit } from '@angular/core';
import { FileExplorerService } from '../_services/file-explorer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileService } from '../_services/file.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {
	folders = [];
	folder_names = [];
	folder_files = [];

	constructor(private fileExplorerService: FileExplorerService,
				private router: Router,
				private route: ActivatedRoute,
				private fileService: FileService) { 

				}

	ngOnInit() {
		this.getFolders();
	}

	getFolders(){
		console.log("hue")
		this.fileExplorerService.getFolders().subscribe(
			data=>{
				console.log("testingdatas", data)
				// this.folders = data;
				for(let i = 0; i<data.length; i++){
					if(!data[i].folder_parent){
						this.folders.push(data[i]);
					}
				}
				console.log(this.folders)
			}
		);
	}

	beadcrumbClick(param){
		this.fileService.getFile(param).subscribe(
			data => {
				console.log(data)
				this.folder_files = data;
			}
		)
		var index = this.folder_names.indexOf(param);
		this.folder_names.splice(index  + 1);
		this.fileExplorerService.getFolders().subscribe(
			data=>{				
				this.folders = [];
				for(let i = 0; i<data.length; i++){
					if(data[i].folder_parent == param){
						this.folders.push(data[i]);
					}
				}


			}
		)
	}

	folderClick(param){
		this.fileExplorerService.getFolders().subscribe(
			data=>{
				// this.folders = data;
				this.folder_names.push(param);
				this.folders = [];
				for(let i = 0; i<data.length; i++){
					if(data[i].folder_parent == param){
						this.folders.push(data[i]);
					}
				}

				this.fileService.getFile(param).subscribe(
					data => {
						console.log(data)
						this.folder_files = data;
					}
				)

			}
		)
	}

	homeClick(){
		this.folder_files = [];
		this.fileExplorerService.getFolders().subscribe(
			data=>{
				this.folders = [];
				this.folder_names = [];
				for(let i = 0; i<data.length; i++){
					if(data[i].folder_parent == false){
						this.folders.push(data[i]);
					}
				}
			}
		)
	}

	fileClick(path, file_name){
		console.log(path + file_name)
		window.open(path+file_name, '_blank');
	}

}
