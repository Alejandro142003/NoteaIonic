import { Component,OnInit,inject } from '@angular/core';
import { AlertController, IonAlert, IonicModule } from '@ionic/angular';
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
  public noteS = inject(NoteService); //noteS.notes$
  constructor(private modalCtrl: ModalController, private alertController:AlertController) {}
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

  async deleteNote(note: Note) {
    const alert = await this.alertController.create({
      header: 'Eliminar nota',
      message: '¿Estás seguro que quieres eliminar la nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Cancelación de eliminación");
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            this.noteS.deleteNote(note)
              .then(() => {
              })
              .catch(error => {
                console.error('Error al eliminar la nota', error);
              });
          }
        }
      ]
    });
    await alert.present();
  }
}
