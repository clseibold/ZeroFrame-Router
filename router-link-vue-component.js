Vue.component('route-link', {
	props: ['to'],
	template: '<a v-on:click="goto"><slot></slot></a>',
	methods: {
		goto: function() {
			Router.navigate(this.to);
		}
	}
});