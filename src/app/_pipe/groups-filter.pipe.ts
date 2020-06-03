import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupsFilter'
})
export class GroupsFilterPipe implements PipeTransform {

	transform(list:any[], value: any, args?: any): any {
		var data = value.split(',');
		return value ? list.filter(item => item.year == data[0] && item.section == data[1]) : list;
	}

}
