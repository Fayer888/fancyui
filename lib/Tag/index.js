import tagComponent from './tag.component';
export default angular.module('tag', [])
  .config(($stateProvider) => {
  "ngInject";
$stateProvider.state('tag', {
  url: '/tag',
  template: '<tag></tag>'
});
})
.component('tag', tagComponent);
