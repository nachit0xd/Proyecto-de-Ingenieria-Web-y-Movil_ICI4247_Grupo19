import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import './Header.css';

const Header: React.FC = () => {
  return (
    <IonHeader className="main-header ion-no-border">
      <IonToolbar className="custom-toolbar">
        {/* Logo / Título de la App */}
        <IonTitle slot="start" className="app-logo">
          Cultura Municipal
        </IonTitle>
        
        {/* Enlaces de Navegación (Visibles solo en el escritorio) */}
        <IonButtons slot="end" className="desktop-nav-links">
          <IonButton routerLink="/ciudadano/inicio">Inicio</IonButton>
          <IonButton routerLink="/ciudadano/catalogo">Catálogo</IonButton>
          <IonButton routerLink="/ciudadano/mapa">Mapa</IonButton>
          <IonButton routerLink="/ciudadano/agenda">Agenda</IonButton>
          <IonButton routerLink="/ciudadano/comunidad">Comunidad</IonButton>
          <IonButton routerLink="/ciudadano/transparencia">Transparencia</IonButton>
        </IonButtons>

        {/* Botón de Perfil / Login */}
        <IonButtons slot="end" className="profile-button">
          <IonButton routerLink="/auth/login">
            <IonIcon icon={personCircleOutline} size="large" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;