import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { CommonModule } from '@angular/common';
import { NoteService } from 'src/app/services/note.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Map as LMap, TileLayer } from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-form-edit',
  standalone: true,
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, LeafletModule],
})
export class FormEditComponent implements OnInit {
  @Input() note!: Note;
  public noteS: NoteService;

  img: boolean = false;
  location: boolean = false;
  showImage: boolean = false;
  showLocation: boolean = false;
  centerLocation?: [number, number] = [0, 0];

  constructor(noteS: NoteService, private modalCtrl: ModalController) {
    this.noteS = noteS;
  }

  ngOnInit() {
    console.log(this.note);
    this.formatDate();
    if (this.note.position) {
      let parts = this.note.position.split(',');

      let latitudString = parts[0].split(': ')[1];
      let longitudString = parts[1].split(': ')[1];

      let latitud = parseFloat(latitudString);
      let longitud = parseFloat(longitudString);

      this.centerLocation = [latitud, longitud];
    }
  }

  public map?: LMap;
  public center = this.centerLocation;
  public options = {
    zoom: 15,
    maxZoom: 20,
    zoomControl: false,
    preferCanvas: true,
    attributionControl: true,
    center: this.centerLocation,
    layers: [
      new TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    ],
  };

  public async onMapReady(lMap: LMap) {
    this.map = lMap;
    setTimeout(() => lMap.invalidateSize(true), 0);
  }

  public marker?: L.Marker;
  public async showMap() {
    if (this.note.position){
      this.showLocation = true;
      setTimeout(() => {
        if (this.centerLocation && this.map) {
          this.map?.setView(this.centerLocation);
          this.map?.invalidateSize();

          let redIcon = new L.Icon({
            iconUrl:
              'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          if (this.marker) {
            this.marker.setLatLng(this.centerLocation);
          } else {
            this.marker = L.marker(this.centerLocation, {
              icon: redIcon,
            }).addTo(this.map);
          }
        }
      }, 0);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log('Estado imagen:' + this.img);
    console.log('Estado location:' + this.location);

    if (this.img) {
      this.note.img = '';
    } else if (this.location) {
      this.note.position = '';
    }

    console.log(this.note);

    return this.modalCtrl.dismiss(this.note, 'confirm');
  }

  async formatDate() {
    let timestampString = this.note.date.replace(/\./g, '');
    let timestamp = Number(timestampString);

    let date = new Date(timestamp);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let hour = date.getHours();
    let minute = date.getMinutes();

    let formatedDate = `${day}/${month}/${year} ${hour}:${minute}`;

    this.note.date = formatedDate;
  }
}
