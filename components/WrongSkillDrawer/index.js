 Component({
   /**
    * 组件的属性列表
    */
   properties: {
     subjectItem: {
       type: Object,
       value: {},
     },
   },

   /**
    * 组件的初始数据
    */
   data: {
     visible: false,
   },

   /**
    * 组件的方法列表
    */
   methods: {

     hideModal: function () {
       if (this.data.visible) {
         this.setData({
           hidding: true,
         });
         setTimeout(() => {
           this.setData({
             visible: !this.data.visible,
             hidding: false,
           });
         }, 100);
       }
     },

     showModal() {
       if (this.data.visible) {
         this.setData({
           visible: false
         })
         return
       }
       this.setData({
         visible: true
       })
     },

   }
 })