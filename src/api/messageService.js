import { whatIsIt } from '@/api/tools'

export const messageService = {
  getSuggestionMessage,
  getPayloadCardMessage,
  getPayloadListMessage,
  getPayloadButtonMessage,
  getTextMessage,
  getPayloadVideoMessage,
  getImageMessage,
  parseMessage,
  getFormMessage
}

function getSuggestionMessage(message, author) {
  var qrMsg = {
    type: 'text',
    author: author,
    data: { text: message.quickReplies.title },
    suggestions: message.quickReplies.quickReplies
  }
  return qrMsg
}

function getPayloadCardMessage(message, author) {
  // Payload Version
  var elements = message.payload.facebook.attachment.payload.elements
  var templateType = message.payload.facebook.attachment.payload.template_type

  var cardMsg =
  {
    type: 'card',
    author: author,
    data: {
      // text: 'No forget the story.',
      template_type: templateType,
      elements: elements
    }
  }
  return cardMsg
}

function getPayloadListMessage(message, author) {
  // Payload Version
  var payload = message.payload.facebook.attachment.payload

  var listMsg =
  {
    type: 'list',
    author: author,
    data: payload
  }
  return listMsg
}

function getPayloadButtonMessage(message, author) {
  var payload = message.payload.facebook.attachment.payload

  var buttonMsg = {
    type: 'button',
    author: author,
    data: payload
  }

  return buttonMsg
}

function getTextMessage(message, author) {
  var textMsgs = []
  message.text.text.forEach((item, index) => {
    var textMsg = {
      type: 'text',
      author: author,
      data: { text: item }
    }
    textMsgs.push(textMsg)
  })

  return textMsgs
}

function getPayloadVideoMessage(message, author) {
  //   { type: 'video', author: `support`, data: { text: `...or not?`, video: {title: 'Honda 2019', text: 'Hello', url: ''} } },
  //   { type: 'video', author: `support`, data: { text: `...or not?`, video: {title: 'Honda 2019', text: 'Hello', source: 'youtube', url: ''} } },
  var elements = message.payload.facebook.attchement.payload.elements

  var videoMsgs = []

  elements.forEach((item, index) => {
    var videoMsg = {
      type: 'video',
      author: author,
      data: {
        text: item.text ? item.text : null,
        media_type: item.media_type,
        source: item.source ? item.source : null,
        url: item.url
      }
    }
    videoMsgs.push(videoMsg)
  })

  return videoMsgs
}

function getImageMessage(message, author) {
  var imageMsg = {
    type: 'image',
    author: author,
    data: {
      elements:
        [
          { url: message.image.imageUri }
        ]
    }
  }
  return imageMsg
}

function getFormMessage(message) {
  var payload = message.payload.facebook.attachment.payload
  var formMessage = {
    type: 'form',
    author: `support`,
    data: payload
  }
  return formMessage
}

function parseMessage(message, author) {
  // console.log(typeof (message.message))
  var received_messages = JSON.parse(message.message)
  if (received_messages['messages']) {
    received_messages = received_messages['messages']
  }
  var results = []
  var richMessage = false
  var texts = []
  // console.log(received_messages)
  if (whatIsIt(received_messages) !== 'Array') { return [] }
  received_messages.forEach((item, index) => {
    if ('platform' in item && item['platform'].toLowerCase() === 'facebook') {
      if ('quickReplies' in item) {
        var textMsg = item.quickReplies.title
        textMsg += ' ['
        item.quickReplies.quickReplies.forEach(item => {
          textMsg += item
          textMsg += ','
        })
        textMsg += ']'
        var qr_msg = {
          type: 'text',
          author: author,
          data: { text: textMsg }
          // suggestions: item.quickReplies.quickReplies
        }
        results.push({
          groupId: message.session_id,
          message: qr_msg,
          unread: 0
        })
        richMessage = true
        // If quick reply, only one message allowed.
      } else if ('text' in item) {
        if (index === 0) {
          var textMsgs = messageService.getTextMessage(item, author)
          textMsgs.forEach((textMsg, index) => {
            results.push({
              groupId: message.session_id,
              message: textMsg,
              unread: 0
            })
          })
          richMessage = true
        } else {
          texts.push({ text: item, index: index })
        }
      } else if ('payload' in item) {
        var msgType = item.payload.facebook.attachment.payload.template_type
        switch (msgType) {
          case 'list':
            var listMsg = messageService.getPayloadListMessage(item, author)
            results.push({
              groupId: message.session_id,
              message: listMsg,
              unread: 0
            })
            richMessage = true
            break
          case 'generic':
            var cardMsg = messageService.getPayloadCardMessage(item, author)
            results.push({
              groupId: message.session_id,
              message: cardMsg,
              unread: 0
            })
            richMessage = true
            break
          case 'button':
            var buttonMsg = messageService.getPayloadButtonMessage(item, author)
            results.push({
              groupId: message.session_id,
              message: buttonMsg,
              unread: 0
            })
            richMessage = true
            break
          case 'media':
            var videoMsgs = messageService.getPayloadVideoMessage(item, author)
            videoMsgs.forEach((videoMsg, index) => {
              results.push({
                groupId: message.session_id,
                message: videoMsg,
                unread: 0
              })
            })
            richMessage = true
            break
          case 'form':
            var formMsg = messageService.getFormMessage(item)
            results.push({
              groupId: message.session_id,
              message: formMsg,
              unread: 0
            })
            richMessage = true
            break
          default:
            break
        }
      } else if ('image' in item) {
        var imageMsg = messageService.getImageMessage(item, author)
        results.push({
          groupId: message.session_id,
          message: imageMsg,
          unread: 0
        })
        richMessage = true
      }
    } else {
      if ('text' in item) {
        texts.push({ text: item, index: index })
      }
    }
  })

  if (!richMessage) {
    texts.forEach((item, index) => {
      var textMsgs = messageService.getTextMessage(item.text, author)
      textMsgs.forEach((textMsg, index) => {
        results.push({
          groupId: message.session_id,
          message: textMsg,
          unread: 0
        })
      })
    })
  }
  // console.log(results.length)
  return results
}
