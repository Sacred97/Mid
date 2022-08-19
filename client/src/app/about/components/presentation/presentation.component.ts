import { Component, OnInit } from '@angular/core';
import {PresentationService} from "../../../shared/services-interfaces/presentation-service/presentation.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  constructor(private presentationService: PresentationService) { }

  presentation: string[] = []
  urlForGoogleDocs: string = environment.apiUrl

  ngOnInit(): void {
    this.presentationService.getFilesName()
      .then(res => {
        this.presentation = res
        console.log(res);
      }, error => {
        console.log(error);
      })
  }

  download(fileName: string) {
    this.presentationService.download(fileName)
      .subscribe((file: any) => {
        let binaryData = []
        binaryData.push(file)
        let downloadLink = document.createElement("a")
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}))
        downloadLink.setAttribute('download', fileName)
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // let binaryString = window.atob(file);
        // let binaryLen = binaryString.length;
        // let bytes = new Uint8Array(binaryLen);
        //
        // for (let i = 0; i < binaryLen; i++) {
        //   let ascii = binaryString.charCodeAt(i);
        //   bytes[i] = ascii;
        // }
        //
        // let blob = new Blob([bytes], {type: "application/pdf"});
        // let link = URL.createObjectURL(blob);
        // window.open(link, '_blank');

      }, error => {
        console.log(error);
      })
  }

}
