import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateActivity'
})
export class DateActivityPipe implements PipeTransform {

	transform(value: string) {
		var datePipe = new DatePipe("en-US");
		value = datePipe.transform(value, 'MMM dd,  h:mm a');
		return value;
	}

}
