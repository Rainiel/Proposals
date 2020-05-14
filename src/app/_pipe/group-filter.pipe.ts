import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupFilter'
})
export class GroupFilterPipe implements PipeTransform {

	transform(list:any[], value: any, args?: any): any {
		console.log(list, value);
		// return value ? list.filter(item => item.year == data[0] && item.section == data[1]) : list;
	}

}
