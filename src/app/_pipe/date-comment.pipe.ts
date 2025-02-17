import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateComment'
})
export class DateCommentPipe implements PipeTransform {

	transform(value: string) {
		var datePipe = new DatePipe("en-US");
		value = datePipe.transform(value, 'MM-dd-yyyy,  h:mm a');
		return value;
	}

}
