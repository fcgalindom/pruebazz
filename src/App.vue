<template>
  <div class="wrapper">
    <!-- Main Header -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <!-- Left navbar links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <a href="index3.html" class="nav-link">Home</a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <a href="#" class="nav-link">Contact</a>
        </li>
      </ul>

      <!-- Right navbar links -->
      <ul class="navbar-nav ml-auto">
        <!-- Navbar Search -->
        <li class="nav-item">
          <a class="nav-link" data-widget="navbar-search" href="#" role="button">
            <i class="fas fa-search"></i>
          </a>
          <div class="navbar-search-block">
            <form class="form-inline">
              <div class="input-group input-group-sm">
                <input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" v-model="searchTerm">
                <div class="input-group-append">
                  <button class="btn btn-navbar" type="submit">
                    <i class="fas fa-search"></i>
                  </button>
                  <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="index3.html" class="brand-link">
        <img src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
        <span class="brand-text font-weight-light">AdminLTE 3</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
          <div class="image">
            <img src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
          </div>
          <div class="info">
            <a href="#" class="d-block">Alexander Pierce</a>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <!-- Search Input -->
            <li class="nav-item">
              <input type="text" class="form-control" placeholder="Search Menu" v-model="searchTerm">
            </li>
            <!-- Filtered Menu Items -->
            <li v-for="item in filteredMenuItems" :key="item.name" class="nav-item" :class="{ 'has-treeview': item.submenu }">
              <router-link :to="item.link" class="nav-link">
                <i :class="item.icon"></i>
                <p style="margin-left: .3rem;">
                  {{ item.name }}
                  <i v-if="item.submenu" class="right fas fa-angle-left"></i>
                </p>
              </router-link>
              <ul v-if="item.submenu" class="nav nav-treeview">
                <li v-for="subItem in item.submenu" :key="subItem.name" class="nav-item" :class="{ 'has-treeview': subItem.submenu }">
                  <router-link :to="subItem.link" class="nav-link">
                    <i :class="subItem.icon"></i>
                    <p>
                      {{ subItem.name }}
                      <i v-if="subItem.submenu" class="right fas fa-angle-left"></i>
                    </p>
                  </router-link>
                  <ul v-if="subItem.submenu" class="nav nav-treeview">
                    <li v-for="subSubItem in subItem.submenu" :key="subSubItem.name" class="nav-item">
                      <router-link :to="subSubItem.link" class="nav-link">
                        <i :class="subSubItem.icon"></i>
                        <p>{{ subSubItem.name }}</p>
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <!-- Route View -->
          <router-view></router-view>
        </div>
      </section>
      <!-- /.content -->
    </div>

    <!-- Main Footer -->
    <footer class="main-footer">
      <div class="float-right d-none d-sm-inline">Anything you want</div>
      <strong>Copyright &copy; 2024 <a href="https://adminlte.io">AdminLTE.io</a>.</strong>
      All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Reactive property for search term
const searchTerm = ref('')

// Sample menu items with submenus
const menuItems = [
  { 
    name: 'Clientes', 
    link: '/customers', 
    icon: 'fas fa-user-tag' 
  },
  { 
    name: 'Rifas', 
    link: '/raffles', 
    icon: 'fas fa-table' 
  },
  { 
    name: 'Boletas', 
    link: '#', 
    icon: 'fas fa-cogs',
    submenu: [
      { name: 'Boletas disponibles', link: '/tickets', icon: 'far fa-circle nav-icon' },
      { name: 'Boletas con abono', link: '/tickets', icon: 'far fa-circle nav-icon' },
      { name: 'Boletas reservadas', link: '/tickets', icon: 'far fa-circle nav-icon' },
      { name: 'Boletas pagadas', link: '/tickets', icon: 'far fa-circle nav-icon' }
    ]
  },
  { 
    name: 'Vendedores', 
    link: '/sellers', 
    icon: 'fas fa-user' 
  },
  { 
    name: 'Promociones', 
    link: '#', 
    icon: 'fas fa-tags'
  },
  { 
    name: 'Reportes', 
    link: '#', 
    icon: 'fas fa-cogs',
    submenu: [
      { name: 'Ventas por vendedor', link: '#', icon: 'far fa-circle nav-icon' },
      { name: 'Total recaudado', link: '#', icon: 'far fa-circle nav-icon' },
      { name: 'Ventas por ciudad', link: '#', icon: 'far fa-circle nav-icon' }
    ]
  },
  // Add more menu items here
]

// Computed property to filter menu items based on search term
const filteredMenuItems = computed(() => {
  return menuItems.map(item => {
    if (item.submenu) {
      const filteredSubmenu = item.submenu.map(subItem => {
        // @ts-ignore
        if (subItem.submenu) {
          // @ts-ignore
          const filteredSubSubmenu = subItem.submenu.filter(subSubItem => 
            subSubItem.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
          return {
            ...subItem,
            submenu: filteredSubSubmenu
          }
        } else if (subItem.name.toLowerCase().includes(searchTerm.value.toLowerCase())) {
          return subItem
        }
        return null
      }).filter(subItem => subItem !== null)
      return {
        ...item,
        submenu: filteredSubmenu
      }
    } else if (item.name.toLowerCase().includes(searchTerm.value.toLowerCase())) {
      return item
    }
    return null
  }).filter(item => item !== null)
})
</script>