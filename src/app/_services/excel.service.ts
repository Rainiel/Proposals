import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
	providedIn: 'root'
})
export class ExcelService {
	url = 'http://localhost:4000';
	arrayBuffer: any;
	exceljsondata: any;
	file: any;

	constructor(private http: HttpClient, private userService: UserService) { }
	// ------------------------------------------ Uploading pdf file of students
	public exportAsExcelFile(json: any[], excelFileName: string): void {

		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		console.log('worksheet', worksheet);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		//const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	private saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
			type: EXCEL_TYPE
		});
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
	}
	// ------------------------------------------- 
	onFileChange(event) {
		if (event.target.files.length > 0) {
			this.file = event.target.files[0];
			console.log('file', this.file)
		}
	}
	Upload() {
		let fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			var data = new Uint8Array(this.arrayBuffer);
			var arr = new Array();
			for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			var bstr = arr.join("");
			var workbook = XLSX.read(bstr, { type: "binary" });
			var first_sheet_name = workbook.SheetNames[0];
			var worksheet = workbook.Sheets[first_sheet_name];
			this.exceljsondata = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: "" });

			console.log('exceljsondata', this.exceljsondata);
			for (let i = 0; i < this.exceljsondata.length; i++) {
				this.userService.register(this.exceljsondata[i]).subscribe(
					data => {
					}
				);
			}
		}
		fileReader.readAsArrayBuffer(this.file);
	}
	importexcel(providrdata): Observable<any> {
		return this.http.post(`${this.url}/defense_schedule`, providrdata);
	}

}
