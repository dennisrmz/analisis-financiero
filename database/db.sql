CREATE DATABASE analisisfinanciero;

use analisisfinanciero;

drop table if exists CUENTA;

drop table if exists ESTADOFINANCIERO;

drop table if exists ESTADOFINANCIERO_MAYORIZACION;

drop table if exists MAYORIZACION;

drop table if exists MOVIMIENTO;

drop table if exists NATURALEZA;

drop table if exists PERIODOCONTABLE;

drop table if exists RUBRO;

drop table if exists TIPOTRANSACCION;

drop table if exists TRANSACCION;

/*==============================================================*/
/* Table: CUENTA                                                */
/*==============================================================*/
create table CUENTA
(
   ID_CUENTA            int not null AUTO_INCREMENT,
   CODIGO_CUENTA        int not null,
   NOMBRE_CUENTA        varchar(50) not null,
   ID_NATURALEZA_CUENTA int,
   ID_RUBRO             int,
   CODIGO_CUENTA_PADRE  int,
   NIVELH               int not null,
   primary key (ID_CUENTA)
);

/*==============================================================*/
/* Table: ESTADOFINANCIERO                                      */
/*==============================================================*/
create table ESTADOFINANCIERO
(
   ID_ESTADOFINANCIERO  int not null AUTO_INCREMENT,
   ID_PERIODOCONTABLE   int not null,
   NOMBRE_ESTADOFINANCIERO varchar(45) not null,
   primary key (ID_ESTADOFINANCIERO)
);

/*==============================================================*/
/* Table: ESTADOFINANCIERO_MAYORIZACION                         */
/*==============================================================*/
create table ESTADOFINANCIERO_MAYORIZACION
(
   ID_ESTADOFINANCIERO  int not null,
   ID_MAYORIZACION      int not null,
   primary key (ID_ESTADOFINANCIERO, ID_MAYORIZACION)
);

/*==============================================================*/
/* Table: MAYORIZACION                                          */
/*==============================================================*/
create table MAYORIZACION
(
   ID_MAYORIZACION      int not null AUTO_INCREMENT,
   MONTO_SALDO          decimal not null,
   ES_SALDO_ACREEDOR    bool not null,
   primary key (ID_MAYORIZACION)
);

/*==============================================================*/
/* Table: MOVIMIENTO                                            */
/*==============================================================*/
create table MOVIMIENTO
(
   ID_MOVIMIENTO        int not null AUTO_INCREMENT,
   ID_TRANSACCION       int,
   ID_MAYORIZACION      int,
   ID_CUENTA            int,
   MONTO_CARGO          decimal not null,
   MONTO_ABONO          decimal not null,
   primary key (ID_MOVIMIENTO)
);

/*==============================================================*/
/* Table: NATURALEZA                                            */
/*==============================================================*/
create table NATURALEZA
(
   ID_NATURALEZA_CUENTA int not null AUTO_INCREMENT,
   TIPO_NATURALEZA_CUETA varchar(10) not null,
   primary key (ID_NATURALEZA_CUENTA)
);

/*==============================================================*/
/* Table: PERIODOCONTABLE                                       */
/*==============================================================*/
create table PERIODOCONTABLE
(
   ID_PERIODOCONTABLE   int not null AUTO_INCREMENT,
   FECHAINICIO_PERIODO  date not null,
   FECHAFINAL_PERIODO   date,
   primary key (ID_PERIODOCONTABLE)
);

/*==============================================================*/
/* Table: RUBRO                                                 */
/*==============================================================*/
create table RUBRO
(
   ID_RUBRO             int not null AUTO_INCREMENT,
   CODIGO_RUBRO         int not null,
   NOMBRE_RUBRO         varchar(50) not null,
   RUB_ID_RUBRO         int,
   primary key (ID_RUBRO)
);

/*==============================================================*/
/* Table: TIPOTRANSACCION                                       */
/*==============================================================*/
create table TIPOTRANSACCION
(
   CODIGO_TIPO_TRANSACCION int not null AUTO_INCREMENT,
   NOMBRE_TIPO_TRANSACCION char(50) not null,
   DESCRIPCION_TIPO_TRANSACCION char(250) not null,
   primary key (CODIGO_TIPO_TRANSACCION)
);

/*==============================================================*/
/* Table: TRANSACCION                                           */
/*==============================================================*/
create table TRANSACCION
(
   ID_TRANSACCION       int not null AUTO_INCREMENT,
   CODIGO_TIPO_TRANSACCION int,
   ID_PERIODOCONTABLE   int,
   FECHA_TRANSACCION    date not null,
   NUMERO_TRANSACCION   int,
   DESCRIPCION_TRANSACCION varchar(50) not null,
   MONTO_TRANSACCION    decimal not null,
   ES_AJUSTE            bool,
   primary key (ID_TRANSACCION)
);

alter table CUENTA add constraint FK_CUENTA_MOVIMIENTO2 foreign key (ID_RUBRO)
      references RUBRO (ID_RUBRO) on delete restrict on update restrict;

alter table CUENTA add constraint FK_POSEE1 foreign key (ID_NATURALEZA_CUENTA)
      references NATURALEZA (ID_NATURALEZA_CUENTA) on delete restrict on update restrict;

alter table ESTADOFINANCIERO add constraint FK_ESTADOFINANCIERO_PERIODOCONTABLE foreign key (ID_PERIODOCONTABLE)
      references PERIODOCONTABLE (ID_PERIODOCONTABLE) on delete restrict on update restrict;

alter table ESTADOFINANCIERO_MAYORIZACION add constraint FK_ESTADOFINANCIERO_MAYORIZACION foreign key (ID_ESTADOFINANCIERO)
      references ESTADOFINANCIERO (ID_ESTADOFINANCIERO) on delete restrict on update restrict;

alter table ESTADOFINANCIERO_MAYORIZACION add constraint FK_ESTADOFINANCIERO_MAYORIZACION2 foreign key (ID_MAYORIZACION)
      references MAYORIZACION (ID_MAYORIZACION) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_CUENTA_MOVIMIENTO foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_MAYORIZACION_MOVIMIENTO foreign key (ID_MAYORIZACION)
      references MAYORIZACION (ID_MAYORIZACION) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_OCURREN foreign key (ID_TRANSACCION)
      references TRANSACCION (ID_TRANSACCION) on delete restrict on update restrict;

alter table RUBRO add constraint FK_CONTIENE foreign key (RUB_ID_RUBRO)
      references RUBRO (ID_RUBRO) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_PERIODOCONTABLE_TRANSACCION foreign key (ID_PERIODOCONTABLE)
      references PERIODOCONTABLE (ID_PERIODOCONTABLE) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_POSEE foreign key (CODIGO_TIPO_TRANSACCION)
      references TIPOTRANSACCION (CODIGO_TIPO_TRANSACCION) on delete restrict on update restrict;

