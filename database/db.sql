CREATE DATABASE analisisfinanciero;

use analisisfinanciero;
-- min 40:00
drop table if exists CUENTA;

drop table if exists DETALLE;

drop table if exists ESTADOFINANCIERO;

drop table if exists ESTADOFINANCIERO_MAYORIZACION;

drop table if exists FACTURA_IMPUESTO;

drop table if exists IMPUESTO;

drop table if exists KARDEX;

drop table if exists MATERIAPRIMA;

drop table if exists MAYORIZACION;

drop table if exists MOVIMIENTO;

drop table if exists NATURALEZA;

drop table if exists PERIODOCONTABLE;

drop table if exists PRODUCTO;

drop table if exists RECURSO;

drop table if exists RUBRO;

drop table if exists TRANSACCION;

drop table if exists VENTA;

create table CUENTA
(
   ID_CUENTA            int(5) AUTO_INCREMENT,
   CODIGO_CUENTA        int(6) not null,
   NOMBRE_CUENTA        varchar(50) not null,
   ID_NATURALEZA_CUENTA int(1),
   ID_RUBRO             int(3),
   CODIGO_CUENTA_PADRE  int(6),
   NIVEL               int(2),
   primary key (ID_CUENTA)
);


create table DETALLE
(
   CODIGO_DETALLE       int(3) not null AUTO_INCREMENT,
   CODIGO_FACTURA       int(3) not null,
   CODIGO_MATERIA_PRIMA int(3),
   CODIGO_PRODUCTO      int(3),
   CANTIDAD_DETALLE     int(3) not null,
   primary key (CODIGO_DETALLE)
);


create table ESTADOFINANCIERO
(
   ID_ESTADOFINANCIERO  int(3) not null AUTO_INCREMENT,
   ID_PERIODOCONTABLE   int(3) not null,
   NOMBRE_ESTADOFINANCIERO varchar(45) not null,
   primary key (ID_ESTADOFINANCIERO)
);


create table FACTURA_IMPUESTO
(
   CODIGO_APLICACION    int(3) not null AUTO_INCREMENT,
   CODIGO_FACTURA       int(3) not null,
   CODIGO_IMPUESTO      int(3) not null,
   MONTO_APLICACION     decimal(3) not null,
   primary key (CODIGO_APLICACION)
);


create table ESTADOFINANCIERO_MAYORIZACION
(
   ID_ESTADOFINANCIERO  int(3) not null,
   ID_MAYORIZACION      int(3) not null,
   primary key (ID_ESTADOFINANCIERO, ID_MAYORIZACION)
);


create table IMPUESTO
(
   CODIGO_IMPUESTO      int(3) not null AUTO_INCREMENT,
   NOMBRE_IMPUESTO      char(50) not null,
   DESCRIPCION_IMPUESTO char(250) not null,
   TASA_IMPUESTO        decimal(3,2) not null,
   primary key (CODIGO_IMPUESTO)
);


create table KARDEX
(
   CODIGO_KARDEX        int(3) not null AUTO_INCREMENT,
   CODIGO_RECURSO       int(3) not null,
   primary key (CODIGO_KARDEX)
);


create table MATERIAPRIMA
(
   CODIGO_MATERIA_PRIMA int(3) not null AUTO_INCREMENT,
   CODIGO_RECURSO       int(3) not null,
   CODIGO_PRODUCTO      int(3) not null,
   primary key (CODIGO_MATERIA_PRIMA)
);


create table MAYORIZACION
(
   ID_MAYORIZACION      int(3) not null AUTO_INCREMENT,
   MONTO_SALDO          decimal(3,2) not null,
   ES_SALDO_ACREEDOR    boolean not null,
   primary key (ID_MAYORIZACION)
);


create table MOVIMIENTO
(
   ID_MOVIMIENTO        int(3) not null AUTO_INCREMENT,
   CODIGO_KARDEX        int(3),
   ID_TRANSACCION       int(3),
   ID_MAYORIZACION      int(3),
   ID_CUENTA            int(3),
   MONTO_CARGO          decimal(3,2) not null,
   MONTO_ABONO          decimal(3,2) not null,
   primary key (ID_MOVIMIENTO)
);


create table NATURALEZA
(
   ID_NATURALEZA_CUENTA int(1) not null AUTO_INCREMENT,
   TIPO_NATURALEZA_CUETA varchar(10) not null,
   primary key (ID_NATURALEZA_CUENTA)
);


create table PERIODOCONTABLE
(
   ID_PERIODOCONTABLE   int(3) not null AUTO_INCREMENT,
   FECHAINICIO_PERIODO  date not null,
   FECHAFINAL_PERIODO   date,
   primary key (ID_PERIODOCONTABLE)
);


create table PRODUCTO
(
   CODIGO_PRODUCTO      int(3) not null AUTO_INCREMENT,
   CODIGO_RECURSO       int(3) not null,
   primary key (CODIGO_PRODUCTO)
);


create table RECURSO
(
   CODIGO_RECURSO       int(3) not null AUTO_INCREMENT,
   NOMBRE_RECURSO       char(100) not null,
   DESCRIPCION_RECURSO  char(250) not null,
   primary key (CODIGO_RECURSO)
);


create table RUBRO
(
   ID_RUBRO             int(3) not null AUTO_INCREMENT,
   CODIGO_RUBRO         int(3),
   NOMBRE_RUBRO         varchar(50) not null,
   CODIGO_CUENTA_PADRE  int(6),
   primary key (ID_RUBRO)
);


create table TRANSACCION
(
   ID_TRANSACCION       int (3) not null AUTO_INCREMENT,
   ID_PERIODOCONTABLE   int (3),
   CODIGO_TRANSACCION   int (3) not null,
   FECHA_TRANSACCION    date not null,
   NUMERO_TRANSACCION   int (3),
   DESCRIPCION_TRANSACCION varchar(50) not null,
   MONTO_TRANSACCION    decimal(3,2) not null,
   ES_AJUSTE            boolean not null,
   primary key (ID_TRANSACCION)
);


create table VENTA
(
   CODIGO_FACTURA       int(3) not null AUTO_INCREMENT,
   SUB_TOTAL_FACTURA    decimal(3,2) not null,
   TOTAL_FACTURA        decimal(3,2) not null,
   ESTADO_FACTURA       char(15) not null,
   primary key (CODIGO_FACTURA)
);

alter table CUENTA add constraint FK_POSEE1 foreign key (ID_NATURALEZA_CUENTA)
      references NATURALEZA (ID_NATURALEZA_CUENTA) on delete restrict on update restrict;

alter table CUENTA add constraint FK_SE_COMPONE foreign key (ID_RUBRO)
      references RUBRO (ID_RUBRO) on delete restrict on update restrict;

alter table DETALLE add constraint FK_DETALLE_MATERIA_PRIMA foreign key (CODIGO_PRODUCTO)
      references PRODUCTO (CODIGO_PRODUCTO) on delete restrict on update restrict;

alter table DETALLE add constraint FK_DETALLE_PRODUCTO foreign key (CODIGO_MATERIA_PRIMA)
      references MATERIAPRIMA (CODIGO_MATERIA_PRIMA) on delete restrict on update restrict;

alter table DETALLE add constraint FK_FACTURA_DETALLE foreign key (CODIGO_FACTURA)
      references VENTA (CODIGO_FACTURA) on delete restrict on update restrict;

alter table ESTADOFINANCIERO add constraint FK_ESTADOFINANCIERO_PERIODOCONTABLE foreign key (ID_PERIODOCONTABLE)
      references PERIODOCONTABLE (ID_PERIODOCONTABLE) on delete restrict on update restrict;

alter table FACTURA_IMPUESTO add constraint FK_FACTURA_APLICACION foreign key (CODIGO_FACTURA)
      references VENTA (CODIGO_FACTURA) on delete restrict on update restrict;

alter table FACTURA_IMPUESTO add constraint FK_IMPUESTO_APLICACION foreign key (CODIGO_IMPUESTO)
      references IMPUESTO (CODIGO_IMPUESTO) on delete restrict on update restrict;

alter table ESTADOFINANCIERO_MAYORIZACION add constraint FK_ESTADOFINANCIERO_MAYORIZACION foreign key (ID_ESTADOFINANCIERO)
      references ESTADOFINANCIERO (ID_ESTADOFINANCIERO) on delete restrict on update restrict;

alter table ESTADOFINANCIERO_MAYORIZACION add constraint FK_ESTADOFINANCIERO_MAYORIZACION2 foreign key (ID_MAYORIZACION)
      references MAYORIZACION (ID_MAYORIZACION) on delete restrict on update restrict;

alter table KARDEX add constraint FK_KARDEX_RECURSO foreign key (CODIGO_RECURSO)
      references RECURSO (CODIGO_RECURSO) on delete restrict on update restrict;

alter table MATERIAPRIMA add constraint FK_PRODUCTO_MATERIAPRIMA foreign key (CODIGO_PRODUCTO)
      references PRODUCTO (CODIGO_PRODUCTO) on delete restrict on update restrict;

alter table MATERIAPRIMA add constraint FK_PRODUCTO_RECURSO foreign key (CODIGO_RECURSO)
      references RECURSO (CODIGO_RECURSO) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_CUENTA_MOVIMIENTO foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_MAYORIZACION_MOVIMIENTO foreign key (ID_MAYORIZACION)
      references MAYORIZACION (ID_MAYORIZACION) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_OCURREN foreign key (ID_TRANSACCION)
      references TRANSACCION (ID_TRANSACCION) on delete restrict on update restrict;

alter table MOVIMIENTO add constraint FK_POSEE foreign key (CODIGO_KARDEX)
      references KARDEX (CODIGO_KARDEX) on delete restrict on update restrict;

alter table PRODUCTO add constraint FK_MATERIA_PRIMA_RECURSO foreign key (CODIGO_RECURSO)
      references RECURSO (CODIGO_RECURSO) on delete restrict on update restrict;

alter table RUBRO add constraint FK_CONTIENE foreign key (CODIGO_RUBRO)
      references RUBRO (ID_RUBRO) on delete restrict on update restrict;

alter table TRANSACCION add constraint FK_PERIODOCONTABLE_TRANSACCION foreign key (ID_PERIODOCONTABLE)
      references PERIODOCONTABLE (ID_PERIODOCONTABLE) on delete restrict on update restrict;