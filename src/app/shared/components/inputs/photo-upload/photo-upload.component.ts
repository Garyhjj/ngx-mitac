// tslint:disable
import { Component, OnInit } from '@angular/core';
import { APIGlobalConfig } from '../../../config/api-global.config';
import { AppService } from '../../../../core/services/app.service';
import { APPConfig } from '../../../config/app.config';

const maxsize = 100 * 1024;

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent implements OnInit {
  uploadUrl = APIGlobalConfig.uploadPicture;
  fileList: any[] = [{
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  }];
  previewImage = '';
  previewVisible = false;

  constructor(
    private appService: AppService
  ) { }

  handlePreview = (file: any) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  beforeUpload = (img: File) => {
    const reader = new FileReader();
    const upload = (base64) => {
      this.appService.uploadPicture(base64).subscribe((url) => {
        this.fileList = this.fileList.concat([{
          name: img.name,
          status: 'done',
          url: APPConfig.baseUrl + url
        }])
      })
    }
    console.log(img)
    const that = this;
    reader.onload = function () {
      var result = this.result;
      var img = new Image();
      img.src = result;
      //如果图片大小小于100kb，则直接上传
      if (result.length <= maxsize) {
        img = null;
        upload(result);
        return;
      }
      //      图片加载完毕之后进行压缩，然后上传
      if (img.complete) {
        callback();
      } else {
        // 浏览器显示原图后触发callback进行压缩上传
        img.onload = callback;
      }
      function callback() {
        var data = that.compress(img);
        upload(data);
        img = null;
      }
    };
    // 去读取选择的文件到内存
    reader.readAsDataURL(img);
    // reader.onloadend = () => {
    //   this.appService.uploadPicture(reader.result).subscribe((url) => {
    //     this.fileList = this.fileList.concat([{
    //       name: img.name,
    //       status: 'done',
    //       url: APPConfig.baseUrl + url
    //     }])
    //   })
    // };
    // reader.readAsDataURL(img);
    return false;
  }

  compress(img) {
    const canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    const tCanvas = document.createElement("canvas");
    var tctx = tCanvas.getContext("2d");
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000) > 1) {
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //        铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
      // ~~ 的作用类似于Math.floor(),性能会好一点
      count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
      //            计算每块瓦片的宽和高
      var nw = ~~(width / count);
      var nh = ~~(height / count);
      tCanvas.width = nw;
      tCanvas.height = nh;
      // 先画一个小的tctx，然后将小的从左到右，从上到下画到大的ctx画布上
      for (var i = 0; i < count; i++) {
        for (var j = 0; j < count; j++) {
          tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }
    //进行最小压缩（真正压缩的api）
    var ndata = canvas.toDataURL('image/jpeg', 0.3);
    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
  }
  ngOnInit() {
  }

}
