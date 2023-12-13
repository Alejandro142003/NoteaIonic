import { Component,inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { FormEditComponent } from '../components/form-edit/form-edit.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab2Page {
  //public misnotas:Note[]=[];
  public noteS = inject(NoteService); //noteS.notes$
  constructor(private modalCtrl: ModalController) {}

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Borrar',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  //Resutl Alert buttons
  setResult(ev:any, note:Note) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    if (ev.detail.role == 'confirm') {
      this.deleteNote(note)
    }
  }



  ionViewDidEnter() {}

  async editNote(note: Note) {
    console.log(note);
    const modal = await this.modalCtrl.create({
      component: FormEditComponent,
      componentProps: { note: note },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.noteS.updateNote(data);
      //Añadir toast satisfactorio
    }
  }
  deleteNote(note: Note) {
    this.noteS.deleteNote(note);
    //Toast implementation
  }
}
