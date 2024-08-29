<template>
  <div class="sc-inventory--element" :style="messageColors">
    <div class="sc-inventory--element-icon">
      <Swiper v-if="data.image_urls.length>0" ref="swiper" :auto-play="false" :show-indicator="false">
        <Slide v-for="(item,index) in data.image_urls" :key="index">
          <img :src="item" class="sc-image">
        </Slide>
      </Swiper>
    </div>
    <div class="sc-inventory--element-title" :style="messageColors">
      {{ data.name }}
    </div>
    <div class="sc-inventory--element-details">
      <div class="sc-inventory--element-stock">
        <div v-if="data.title" class="sc-inventory--element-text" :style="messageColors">{{ data.title }}</div>
        <div v-if="data.subtitle" class="sc-inventory--element-text" :style="messageColors">{{ data.subtitle }}</div>
      </div>
      <div class="sc-inventory--element-price">
        <div v-if="data.meta" class="sc-inventory--element-text" :style="messageColors">{{ data.meta.title }}</div>
        <div v-if="data.meta" class="sc-inventory--element-text-price">{{ data.meta.value }} <p v-if="data.meta.msrp && data.meta.msrp !== '$null'">{{ data.meta.msrp }}</p></div>

      </div>
    </div>
    <button class="sc-inventory--element-button" @click="sendItem(data)">Select and Send</button>
  </div>
</template>

<script>
import { Slide, Swiper } from '@/components/Util'
import { mapGetters } from 'vuex'

export default {
  name: 'InventoryElement',
  components: {
    Slide,
    Swiper
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'currentGroupId'
    ])
  },
  methods: {
    sendItem(item) {
      console.log(item)
      // var base_url = 'https://www.dthondachicago.com/inventory/'
      // var payload = ''
      // if (item.series === undefined) {
      //   payload = item.new_used.toLowerCase() + '-' + item.year + '-' + item.make.toLowerCase() + '-' + item.model.toLowerCase() + '-' + item.drivetrain_desc.toLowerCase() + '-' + item.body.toLowerCase() + '-' + item.vin.toLowerCase()
      // } else {
      //   payload = item.new_used.toLowerCase() + '-' + item.year + '-' + item.make.toLowerCase() + '-' + item.model.toLowerCase() + '-' + item.series.toLowerCase() + '-' + item.drivetrain_desc.toLowerCase() + '-' + item.body.toLowerCase() + '-' + item.vin.toLowerCase()
      // }
      var data = {
        type: 'list',
        author: `admin`,
        data: {
          text: item.name + ' MSRP: ' + item.meta.msrp + ' Sale Pice: ' + item.meta.value + ' Exterior: ' + item.meta.exterior + ' Interior: ' + item.meta.interior,
          top_element_style: 'large',
          elements: [{
            title: item.name,
            image_url: item.image_urls[0],
            buttons: [
            ]
          },
          {
            title: item.name,
            subtitle: 'MSRP: ' + item.meta.msrp + ' Sale Pice: ' + item.meta.value + ' Exterior: ' + item.meta.exterior + ' Interior: ' + item.meta.interior,
            image_url: item.image_urls[0],
            images: item.image_urls,
            buttons: [
              {
                type: 'url',
                payload: item.buttons[0].payload,
                title: 'view ' + item.subtitle.split('#')[1]
              }]
          }
          ]
        }
      }
      this.$store.dispatch('chat/sendMessage', { message: data, groupId: this.currentGroupId })
      // this.$emit('sendItem', { payload: data })
    }
  }
}
</script>

<style scoped>
.sc-inventory--element {
  width: 100%;
  border-radius: 15px;
  margin-top: 20px;
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.2);
  /* white-space: pre-wrap; */
  -webkit-font-smoothing: subpixel-antialiased
}

.sc-inventory--element:first-of-type{
    margin-top: 0px;
}

.sc-inventory--element-next {
  /* position: absolute; */
  margin-right: 10px;
}

.sc-inventory--element-icon {
  text-align: center;
  margin: 0px;
}

.sc-image {
  border-radius: 15px 15px 1px 1px;
  width: 100%;
  max-height: 290px;
  object-fit: cover;
}

.sc-inventory--element-details {
    padding: 5px 15px;
    display: flex;
    flex-direction: row;
}

.sc-inventory--element-stock {
    width: 70%;
}

.sc-inventory--element-price {
    width: 30%;
}

.sc-inventory--element-text {
  /* padding-left: 15px; */
  font-weight: 300;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
  /* white-space: pre-wrap; */
  -webkit-font-smoothing: subpixel-antialiased
}

.sc-inventory--element-text-price {
  /* padding-left: 15px; */
  font-weight: 700;
  color: red;
  font-size: 16px;
  line-height: 1.4;
  text-align: left;
  /* white-space: pre-wrap; */
  -webkit-font-smoothing: subpixel-antialiased
}

.sc-inventory--element-text-price p {
  /* padding-left: 15px; */
  display: inline;
  font-weight: 300;
  color: black;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
  text-decoration: line-through;
  /* white-space: pre-wrap; */
  -webkit-font-smoothing: subpixel-antialiased
}

.sc-inventory--element-title {
  /* color: white; */
  color: rgba(0, 0, 0, 1);
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 700;
  text-align: center;
  border-radius: 15px;
}

.sc-inventory--element-subtitle {
  padding-left: 15px;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.4;
  /* white-space: pre-wrap; */
  -webkit-font-smoothing: subpixel-antialiased
}

.sc-inventory--element-button {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.4;
  width: 100%;
  height: 40px;
  overflow: hidden;
  border: 1px solid rgb(31, 149, 231);
  background-color: rgb(31, 149, 231);
  color: white;
  border-radius: 20px;
  /* border: none; */
  cursor: pointer;
}

@media (max-width: 450px) {
  .sc-inventory--element {
  width: 80%;
  border-radius: 6px;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.4;
  /* white-space: pre-wrap; */
  -webkit-font-smoothing: subpixel-antialiased
  }
}
</style>
