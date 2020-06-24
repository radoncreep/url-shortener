const app = new Vue({
    el: '#index',
    data: {
        url: '',
        slug: '',
        created: null
    },
    methods: {
        createUrl() {
            console.log(this.url, this.slug); 
        }
    }
})