const soundUrl = 'https://blissmotorsimages.s3.us-east-2.amazonaws.com/notification.mp3'

export function playSound() {
  if (soundUrl) {
    var audio = new Audio(soundUrl)
    audio.play()
  }
}

export function showNotification(title, msg, imgUrl) {
  var Notification = window.Notification || window.mozNotification || window.webkitNotification
  // Check if browser support desktop notifications
  if (Notification) {
    Notification.requestPermission(function(result) {
      // result default or deneid: deny
      //        granted: agree
      if (result !== 'granted') {
        alert('Please press allow to receive notification!')
        return false
      } else {
        var tag = 'sds' + Math.random()
        var notify = new Notification(
          title,
          {
            dir: 'auto',
            lang: 'en-us',
            tag: tag, // notification id
            icon: imgUrl, // icon support ico、png、jpg、jpeg format
            title: title, // notification title
            body: msg // notification content
          }
        )
        // notify.addEventListener('notificationclick', function(event) {
        //   const url = 'https://example.com/some-path/'
        //   event.notification.close() // Android needs explicit close.
        //   event.waitUntil(
        //     // eslint-disable-next-line no-undef
        //     ServiceWorkerClients.matchAll({ type: 'window' }).then(windowClients => {
        //       // Check if there is already a window/tab open with the target URL
        //       for (var i = 0; i < windowClients.length; i++) {
        //         var client = windowClients[i]
        //         // If so, just focus it.
        //         if (client.url === url && 'focus' in client) {
        //           return client.focus()
        //         }
        //       }
        //       // If not, then open the target URL in a new window/tab.

        //       if (ServiceWorkerClients.openWindow) {
        //         return ServiceWorkerClients.openWindow(url)
        //       }
        //     })
        //   )
        // })
        // Onclick Function
        notify.οnclick = function() {
          // Deprecated now
          console.log('clicked')
          event.preventDefault() // prevent the browser from focusing the Notification's tab
          window.open('localhost:9527', '_blank')
          window.focus()
        }
        // Error Function
        notify.onerror = function() {
          // console.log("");
        }
        // Set auto close
        notify.onshow = function() {
          // Play sound
          var audio = new Audio(soundUrl)
          audio.play()
          // Close after 5s
          setTimeout(function() {
            notify.close()
          }, 5000)
        }
        // Onclose event
        notify.onclose = function() {

        }
      }
    })
  } else {
    // Browser does not support
    alert('Sorry, your browser does not support desktop notifications.')
  }
}

export function randomKey() {
  var length = 5
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function randomCode() {
  var length = 6
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
