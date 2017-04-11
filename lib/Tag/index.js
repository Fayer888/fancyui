import tagComponent from './tag.component';
import deprecated from '../tool/deprecated';

export default angular.module('bp.rate', [

])
.component('fTag', tagComponent)
.component('bpTag',
  deprecated(tagComponent, 'bp-tag', 'f-tag'));