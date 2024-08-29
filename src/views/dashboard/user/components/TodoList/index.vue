<template>
  <section v-loading="todoLoading" class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List" @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked })">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
      <!-- <button v-show="todos.length > remaining" class="clear-completed" @click="clearCompleted">
        Clear completed
      </button> -->
    </footer>
    <div class="save-button">
      <el-button type="primary" size="medium" icon="el-icon-upload" circle @click="save" />
    </div>
  </section>
</template>

<script>
import Todo from './Todo.vue'
import { todoList, saveTodoList } from '@/api/remote-search'
import { mapGetters } from 'vuex'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}
// const defalutList = [
//   { text: 'star this repository', done: false },
//   { text: 'fork this repository', done: false },
//   { text: 'follow author', done: false },
//   { text: 'vue-element-admin', done: true },
//   { text: 'vue', done: true },
//   { text: 'element-ui', done: true },
//   { text: 'axios', done: true },
//   { text: 'webpack', done: true }
// ]
export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  data() {
    return {
      todoLoading: false,
      visibility: 'all',
      filters,
      // defalutList: [],
      // todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
      todos: [],
      deleted: []
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    allChecked() {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    remaining() {
      return this.todos.filter(todo => !todo.done).length
    }
  },
  created() {
    console.log('ToDo List Created')
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.todoLoading = true
      todoList(this.token, null).then(response => {
        this.todos = response.items.slice(0, 15)
        this.todoLoading = false
      }).catch(() => {
        this.todoLoading = false
      })
    },
    setLocalStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    addTodo(e) {
      const text = e.target.value
      if (text.trim()) {
        this.todos.push({
          text,
          done: false
        })
        this.setLocalStorage()
      }
      e.target.value = ''
    },
    toggleTodo(val) {
      val.done = !val.done
      this.setLocalStorage()
    },
    deleteTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      this.deleted.push(todo)
      this.setLocalStorage()
    },
    editTodo({ todo, value }) {
      todo.text = value
      this.setLocalStorage()
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.done)
      this.setLocalStorage()
    },
    toggleAll({ done }) {
      this.todos.forEach(todo => {
        todo.done = done
        this.setLocalStorage()
      })
    },
    save() {
      var items = []
      this.todos.forEach(item => {
        if (item.id) {
          items.push(
            {
              id: item.id,
              item: item.text,
              status: item.done ? 1 : 0
            }
          )
        } else {
          items.push(
            {
              item: item.text,
              status: item.done ? 1 : 0
            }
          )
        }
      })
      this.deleted.forEach(item => {
        if (item.id) {
          items.push(
            {
              id: item.id,
              item: item.text,
              status: -1
            }
          )
        } else {
          items.push(
            {
              item: item.text,
              status: -1
            }
          )
        }
      })
      this.todoLoading = true
      saveTodoList(this.token, items).then(() => {
        this.todoLoading = false
        this.$notify({
          title: 'Success',
          message: 'Saved successfully',
          type: 'success'
        })
      }).catch((err) => {
        console.log(err)
        this.todoLoading = false
        this.$notify.error({
          title: 'Error',
          message: 'Failed to save. Please try again.'
        })
      })
    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
