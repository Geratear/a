# shortcut
format:
    shift+alt+f

# Page.js
    page({
        data:{
            latitue:..
            longitude:..
        },
        onload:(options)=>{
            this.setData({options:options, latitude:xx})
        },
        onReady:..
    })

## wx.showToast({title:xx,icon:'loading'})