import tagdemoComponent from './tagdemo.component';
import Tag from '../../../../lib/Tag/index.js';

export default angular.module('tagDemo', [
    Tag.name
])

.component('tagDemo', tagdemoComponent);
