CREATE DATABASE analisisfinanciero;

use analisisfinanciero;
-- min 40:00
drop table if exists CUENTA;

drop table if exists ESTADOFINANCIERO;

drop table if exists ESTADOFINANCIERO_MAYORIZACION;

drop table if exists MAYORIZACION;

drop table if exists MOVIMIENTO;

drop table if exists NATURALEZA;

drop table if exists PERIODOCONTABLE;

drop table if exists TIPOAJUSTE;

drop table if exists TIPOTRANSACCION;

drop table if exists TRANSACCION;

/*==============================================================*/
/* Table: CUENTA                                                */
/*==============================================================*/
create table CUENTA
(
   ID_CUENTA            int not null AUTO_INCREMENT,
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
   ID_CUENTA            int,
   MONTO_SALDO          decimal not null,
   ES_SALDO_ACREEDOR    boolean not null,
   primary key (ID_MAYORIZACION)
);

/*==============================================================*/
/* Table: MOVIMIENTO                                            */
/*==============================================================*/
create table MOVIMIENTO
(
   ID_MOVIMIENTO        int not null AUTO_INCREMENT,
   ID_TRANSACCION       int,
   ID_CUENTA            int,
   FECHA_MOVIMIENTO     date not null,
   DETALLE_MOVIMIENTO   varchar(250) not null,
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
/* Table: TIPOAJUSTE                                            */
/*==============================================================*/
create table TIPOAJUSTE
(
   CODIGO_TIPO_AJUSTE   int not null AUTO_INCREMENT,
   NOMBRE_TIPO_AJUSTE   varchar(50) not null,
   DESCRIPCION_TIPO_AJUSTE varchar(250) not null,
   primary key (CODIGO_TIPO_AJUSTE)
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
   CODIGO_TIPO_AJUSTE   int,
   DESCRIPCION_TRANSACCION varchar(250) not null,
   FECHA_TRANSACCION    date not null,
   MONTO_TRANSACCION    decimal not null,
   ES_AJUSTE            boolean not null,
   primary key (ID_TRANSACCION)
);

alter table CUENTA add constraint FK_POSEE1 foreign key (ID_NATURALEZA_CUENTA)
      references NATURALEZA (ID_NATURALEZA_CUENTA) on delete restrict on update restrict;

alter table ESTADOFINANCIERO add constraint FK_PERTENECE_A foreign key (ID_PERIODOCONTABLE)
      references PERIODOCONTABLE (ID_PERIODOCONTABLE) on delete restrict on update restrict;

alter table ESTADOFINANCIERO_MAYORIZACION add constraint FK_ESTADOFINANCIERO_ESTADOFINANCIERO_MAYORIZACION foreign key (ID_ESTADOFINANCIERO)
      references ESTADOFINANCIERO (ID_ESTADOFINANCIERO) on delete restrict on update restrict;

alter table ESTADOFINANCIERO_MAYORIZACION add constraint FK_ESTADOFINANCIERO_MAYORIZACION2 foreign key (ID_MAYORIZACION)
      references MAYORIZACION (ID_MAYORIZACION) on delete restrict on update restrict;

alter table MAYORIZACION add constraint FK_TIENE foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_OCURREN foreign key (ID_TRANSACCION)
      references TRANSACCION (ID_TRANSACCION) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_REALIZA foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_POSEE foreign key (CODIGO_TIPO_TRANSACCION)
      references TIPOTRANSACCION (CODIGO_TIPO_TRANSACCION) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_POSEE_3 foreign key (CODIGO_TIPO_AJUSTE)
      references TIPOAJUSTE (CODIGO_TIPO_AJUSTE) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_REQUIERE foreign key (ID_PERIODOCONTABLE)
      references PERIODOCONTABLE (ID_PERIODOCONTABLE) on delete restrict on update restrict;
