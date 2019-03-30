const LOAD_NUM = 3;   // global variable for no. of products to load
let watcher;          // make variable available to different lifecycle hooks

setTimeout(() => {    // simulate delay in loading app
  new Vue({
    el: '#app',
    data: {
      total: 0,           // total price
      search: 'cat',      // search term from input box
      lastSearch: '',     // previous search term
      isLoading: false,   // flag
      products: [],       // products to display
      results: [],        // all products from search
      cart: []
    },
    methods: {
      addToCart(product) {
        this.total += product.price;
        const itemIdx = this.cart.findIndex(i => i.id === product.id);  // find if item already in cart
        if (itemIdx >= 0) this.cart[itemIdx].qty ++;
        else this.cart.push({id: product.id, title: product.title, price: product.price, qty: 1});
      },
      inc(item) {
        item.qty++;
        this.total += item.price;
      },
      dec(item) {
        item.qty--;
        this.total -= item.price;
        if (item.qty <= 0) {
          const itemIdx = this.cart.indexOf(item);
          this.cart.splice(itemIdx, 1);
        }
      },
      onSubmit() {
        const vm = this;
        vm.products = [];
        vm.results = [];
        vm.isLoading = true;
        vm.$http.get('/search?q='.concat(this.search))
          .then(response => {
            vm.results = response.body;
            this.appendResults();
            vm.lastSearch = vm.search;
            vm.isLoading = false;
          })
          .catch(err => console.log(err));
      },
      appendResults() {   // add more from 'results' to 'products' triggered by scrolling
        if (this.products.length < this.results.length) {
          const toAppend = this.results.slice(this.products.length, this.products.length + LOAD_NUM);
          this.products = this.products.concat(toAppend);
        }
      }
    },
    filters: {
      currency(price) {
        return '$'.concat(price.toFixed(2));
      }
    },
    created() {
      this.onSubmit();    // load products at beginning
    },
    updated() {     // create scrollmonitor watcher after DOM update
      const sensor = document.querySelector('#product-list-bottom');  // element to monitor during scroll
      watcher = scrollMonitor.create(sensor);
      watcher.enterViewport(this.appendResults);
    },
    beforeUpdate() {    // destroy scrollmonitor watcher before DOM update
      if (watcher) {    // 'watcher' is undefined 1st time it's called
        watcher.destroy();
        watcher = null;
      }
    }
  });  
}, 2000);
