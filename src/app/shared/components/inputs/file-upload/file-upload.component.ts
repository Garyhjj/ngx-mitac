import { filter } from 'rxjs/operators';
// tslint:disable
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  uploading = false;
  fileList: UploadFile[] = [];
  @Input() postUrl;

  @Input() maxCount;
  @Output() uploadSuccess = new EventEmitter<any>();

  @Output() uploadError = new EventEmitter<any>();
  constructor(private http: HttpClient, private msg: NzMessageService) {}
  ngOnInit() {}
  beforeUpload = (file: UploadFile): boolean => {
    while (this.maxCount && this.maxCount <= this.fileList.length) {
      this.fileList.shift();
    }
    this.fileList.push(file);
    return false;
  };

  handleUpload() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest(
      'POST',
      'https://jsonplaceholder.typicode.com/posts/',
      formData,
      {
        // reportProgress: true
      },
    );
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (event: any) => {
          this.uploading = false;
          this.uploadSuccess.emit(event);
          // this.msg.success('upload successfully.');
        },
        err => {
          this.uploading = false;
          this.uploadError.emit(err);
          // this.msg.error('upload failed.');
        },
      );
  }
}
