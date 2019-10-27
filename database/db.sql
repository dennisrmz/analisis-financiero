CREATE DATABASE analisisfinanciero;

use analisisfinanciero;
-- min 40:00
drop table if exists CUENTA;

drop table if exists ESTADOFINANCIERO;

drop table if exists ESTADOFINANCIERO_MAYORIZACION;

drop table if exists MAYORIZACION;

drop table if exists MOVIMIENTO;

drop table if exists NATURALEZA;

drop table if exists NOTAEXPLICATIVA;

drop table if exists PERIODOCONTABLE;

drop table if exists TIPOTRANSACCION;

drop table if exists TRANSACCION;

/*==============================================================*/
/* Table: CUENTA                                                */
/*==============================================================*/
create table CUENTA
(
   ID_CUENTA            int not null,
   ID_NATURALEZA_CUENTA int,
   CODIGO_CUENTA_PADRE  int,
   CODIGO_CUENTA        int not null,
   NOMBRE_CUENTA        varchar(50) not null,
   NIVELH               int not null,
   primary key (ID_CUENTA)
);

/*==============================================================*/
/* Table: ESTADOFINANCIERO                                      */
/*==============================================================*/
create table ESTADOFINANCIERO
(
   ID_ESTADOFINANCIERO  int not null,
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
   ID_MAYORIZACION      int not null,
   MONTO_SALDO          decimal not null,
   ES_SALDO_ACREEDOR    bool not null,
   primary key (ID_MAYORIZACION)
);

/*==============================================================*/
/* Table: MOVIMIENTO                                            */
/*==============================================================*/
create table MOVIMIENTO
(
   ID_MOVIMIENTO        int not null,
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
   ID_NATURALEZA_CUENTA int not null,
   TIPO_NATURALEZA_CUETA varchar(10) not null,
   primary key (ID_NATURALEZA_CUENTA)
);

/*==============================================================*/
/* Table: NOTAEXPLICATIVA                                       */
/*==============================================================*/
create table NOTAEXPLICATIVA
(
   ID_NOTA              int not null,
   ID_ESTADOFINANCIERO  int,
   TITULO_NOTA          varchar(50) not null,
   DESCRIPCION_NOTA     varchar(300) not null,
   primary key (ID_NOTA)
);

/*==============================================================*/
/* Table: PERIODOCONTABLE                                       */
/*==============================================================*/
create table PERIODOCONTABLE
(
   ID_PERIODOCONTABLE   int not null,
   FECHAINICIO_PERIODO  date not null,
   FECHAFINAL_PERIODO   date,
   primary key (ID_PERIODOCONTABLE)
);

/*==============================================================*/
/* Table: TIPOTRANSACCION                                       */
/*==============================================================*/
create table TIPOTRANSACCION
(
   CODIGO_TIPO_TRANSACCION int not null,
   NOMBRE_TIPO_TRANSACCION char(50) not null,
   DESCRIPCION_TIPO_TRANSACCION char(250) not null,
   primary key (CODIGO_TIPO_TRANSACCION)
);

/*==============================================================*/
/* Table: TRANSACCION                                           */
/*==============================================================*/
create table TRANSACCION
(
   ID_TRANSACCION       int not null,
   CODIGO_TIPO_TRANSACCION int,
   ID_PERIODOCONTABLE   int,
   CODIGO_TRANSACCION   int not null,
   FECHA_TRANSACCION    date not null,
   NUMERO_TRANSACCION   int,
   DESCRIPCION_TRANSACCION varchar(50) not null,
   MONTO_TRANSACCION    decimal not null,
   ES_AJUSTE            bool not null,
   primary key (ID_TRANSACCION)
);

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

alter table NOTAEXPLICATIVA add constraint FK_TIENE foreign key (ID_ESTADOFINANCIERO)
      references ESTADOFINANCIERO (ID_ESTADOFINANCIERO) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_PERIODOCONTABLE_TRANSACCION foreign key (ID_PERIODOCONTABLE)
      references PERIODOCONTABLE (ID_PERIODOCONTABLE) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_POSEE foreign key (CODIGO_TIPO_TRANSACCION)
      references TIPOTRANSACCION (CODIGO_TIPO_TRANSACCION) on delete restrict on update restrict;

