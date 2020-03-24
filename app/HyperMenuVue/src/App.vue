<template>
  <div id="app">
    <b-navbar toggleable="md" type="light">


  <!-- <b-navbar-brand href="#"><img src="/static/hypermenu.png" width="150"/></b-navbar-brand> -->
  <b-navbar-nav>
    <b-nav-item><img src="/static/hypermenu-logo.png" width="32"/></b-nav-item>
  </b-navbar-nav>

  <b-navbar-nav right>
     <img src="/static/hypermenu-text.png" width="150"/>
  </b-navbar-nav>

  <b-navbar-toggle right class="nav-bar" target="nav_collapse">
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
  </b-navbar-toggle>

  <!-- <b-navbar-nav>
    <b-nav-form>
      <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
      <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
    </b-nav-form>
  </b-navbar-nav> -->
  <b-collapse is-nav id="nav_collapse">

    <!-- <b-navbar-nav>
      <b-nav-item href="#">Link</b-nav-item>
      <b-nav-item href="#" disabled>Disabled</b-nav-item>
    </b-navbar-nav> -->

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">

      <b-nav-form class="d-flex flex-row">
        <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
        <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
      </b-nav-form>

      <!-- <b-nav-item-dropdown text="Lang" right>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
      </b-nav-item-dropdown> -->

      <b-nav-item-dropdown right>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em>User</em>
        </template>
        <b-dropdown-item href="#">Profile</b-dropdown-item>
        <b-dropdown-item href="#">Signout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>

  </b-collapse>
</b-navbar>
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.nav-bar{
  border: 0;
}
.nav-bar img{
  width: 30px;
}
</style>
