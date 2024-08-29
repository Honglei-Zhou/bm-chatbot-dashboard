
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    first_name: 'Super',
    last_name: 'Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    first_name: 'Normal',
    last_name: 'Editor'
  }
}

console.log(tokens)
console.log(users)

export default [
  // user login
  // {
  //   url: '/user/login',
  //   type: 'post',
  //   response: config => {
  //     const { username } = config.body
  //     var tokenKey = 'admin'
  //     if (username === 'test@gmail.com') {
  //       tokenKey = 'editor'
  //     }
  //     const token = tokens[tokenKey]

  //     // mock error
  //     if (!token) {
  //       return {
  //         code: 60204,
  //         message: 'Account and password are incorrect.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: token
  //     }
  //   }
  // },

  // get user info
  // {
  //   url: '/user/info\.*',
  //   type: 'get',
  //   response: config => {
  //     console.log(config.query)
  //     const { token, email } = config.query
  //     const info = users[token]
  //     console.log(email)

  //     // mock error
  //     if (!info) {
  //       return {
  //         code: 50008,
  //         message: 'Login failed, unable to get user details.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: info
  //     }
  //   }
  // },

  // // user logout
  // {
  //   url: '/user/logout',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: 'success'
  //     }
  //   }
  // }
]
