<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">New User</el-button>
    <el-button type="primary" @click="handleChangePassword">Change Password</el-button>
    <el-table :data="usersList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Email" width="220">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Department">
        <template slot-scope="scope">
          {{ scope.row.dept }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="temp" :rules="registrationRules" label-width="120px" label-position="left">
        <el-form-item label="First Name">
          <el-input v-model="temp.firstName" placeholder="First Name" />
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="temp.lastName" placeholder="Last Name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" :readonly="dialogType==='edit'" type="email" placeholder="Please enter email address." />
        </el-form-item>
        <el-form-item label="Department" prop="dept">
          <el-select v-model="temp.dept" class="filter-item" placeholder="Please select">
            <el-option v-for="item in departmentOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="changePasswordDialogVisible" :title="changePasswordTitle">
      <el-form :model="currentUser" :rules="changePasswordRules" label-width="160px" label-position="left">
        <el-form-item label="Email">
          <el-input v-model="email" :readonly="true" type="email" />
        </el-form-item>
        <el-form-item label="Current Password" prop="currentPassword">
          <el-input v-model="currentUser.currentPassword" type="password" placeholder="Please enter current password." />
        </el-form-item>
        <el-form-item label="New Password" prop="newPassword">
          <el-input v-model="currentUser.newPassword" type="password" placeholder="Please enter new password." />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="currentUser.confirmNewPassword" type="password" placeholder="Please confirm new password." />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="changePasswordDialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmChangePassword">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
// import { addRole, updateRole } from '@/api/role'
import { validEmail } from '@/utils/validate'
import { getAllUsers, deleteUser, updateUser, addUser, changeUserPassword } from '@/api/user'
import { mapGetters } from 'vuex'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      console.log(value)
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }

    var validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.temp.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }
    return {
      temp: {
        id: undefined,
        email: '',
        name: '',
        dept: 'Sales',
        role: 'User'
      },
      currentUser: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      changePasswordDialogVisible: false,
      changePasswordTitle: 'Change Password',
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      departmentOptions: ['Sales', 'Service', 'Management'],
      roleOptions: ['User', 'Admin'],
      registrationRules: {
        email: [{ required: true, message: 'Please enter your email', trigger: 'blur', validator: validateUsername }],
        password: [{ type: 'password', required: true, message: 'Please enter your password', trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ type: 'password', required: true, message: 'Please confirm your password', trigger: 'blur', validator: validateConfirmPass }],
        dept: [{ required: true, message: 'Please choose your department', trigger: 'change' }],
        role: [{ required: true, message: 'Please choose your role', trigger: 'change' }]
      },
      changePasswordRules: {
        email: [{ required: true, message: 'Please enter your email', trigger: 'blur', validator: validateUsername }],
        currentPassword: [{ required: true, message: 'Please enter your password', trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, message: 'Please enter your password', trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, message: 'Please confirm your password', trigger: 'blur', validator: validateConfirmPass }]
      },
      usersList: []
    }
  },
  computed: {
    ...mapGetters([
      'token', 'dealerId', 'email'
    ]),
    routesData() {
      return this.routes
    }
  },
  created() {
    this._getAllUsers()
  },
  methods: {
    _getAllUsers() {
      getAllUsers(this.token, { dealerId: this.dealerId }).then((resp) => {
        console.log(resp.data)
        resp.data.forEach(item => {
          this.usersList.push({
            email: item.email,
            role: item.roles,
            dept: item.departments,
            firstName: item.firstName,
            lastName: item.lastName
          })
        })
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        email: '',
        password: '',
        conformPassword: '',
        firstName: '',
        lastName: '',
        dept: 'Sales',
        role: 'User'
      }
    },

    resetCurrentUser() {
      this.currentUser = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleChangePassword() {
      console.log('Change password')
      this.resetCurrentUser()
      this.changePasswordDialogVisible = true
    },
    handleAddUser() {
      this.resetTemp()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.temp = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(this.token, row.email)
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    confirmChangePassword() {
      var isError = false
      var errorMsg = ''
      changeUserPassword(this.token, { email: this.email, currentPassword: this.currentUser.currentPassword, newPassword: this.currentUser.newPassword }).then((resp) => {
        console.log(resp)
        isError = resp.isError
        errorMsg = resp.message
        this.changePasswordDialogVisible = false
        if (isError) {
          this.$notify({
            title: 'Error',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Message: ${errorMsg}</div>
          `,
            type: 'error'
          })
        } else {
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Email: ${this.email}</div>
            <div>Message: ${errorMsg}</div>
          `,
            type: 'success'
          })
        }
      }).catch(() => {
        this.changePasswordDialogVisible = false
      })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      //   const checkedKeys = this.$refs.tree.getCheckedKeys()
      //   this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      var isError = false
      var errorMsg = ''
      if (isEdit) {
        updateUser(this.token, this.temp).then((resp) => {
          isError = resp.isError
          errorMsg = resp.message
          if (!isError) {
            for (let index = 0; index < this.usersList.length; index++) {
              if (this.usersList[index].email === this.temp.email) {
                this.usersList.splice(index, 1, Object.assign({}, this.temp))
                break
              }
            }
          }
        })
      } else {
        addUser(this.token, this.temp).then((resp) => {
          console.log(resp)
          isError = resp.isError
          errorMsg = resp.message
          if (!isError) {
            this.usersList.push(this.temp)
          }
        })
      }

      //   const { email, role, dept } = this.temp
      this.dialogVisible = false
      if (isError) {
        this.$notify({
          title: 'Error',
          dangerouslyUseHTMLString: true,
          message: `
            <div>Message: ${errorMsg}</div>
          `,
          type: 'error'
        })
      } else {
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>Email: ${this.temp.email}</div>
            <div>Role Name: ${this.temp.role}</div>
            <div>Department: ${this.temp.dept}</div>
          `,
          type: 'success'
        })
      }
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
