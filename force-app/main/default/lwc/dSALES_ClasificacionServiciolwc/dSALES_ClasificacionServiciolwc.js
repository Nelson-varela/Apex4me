import { LightningElement, api, track, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getCategoria from '@salesforce/apex/DSALES_ClasificacionServicio.getPickListCategoria';
import SendCat from '@salesforce/apex/DSALES_ClasificacionServicio.getPicklistOptionsDependent';
import getRecords from '@salesforce/apex/DSALES_ClasificacionServicio.getRecords';
import upsertRecord from '@salesforce/apex/DSALES_ClasificacionServicio.upsertRecord';
import getSku from '@salesforce/apex/DSALES_ClasificacionServicio.getBuscarSKU';
import getProfileType from '@salesforce/apex/DSALES_ClasificacionServicio.checkProfileType';
import getCategories from '@salesforce/apex/DSALES_ClasificacionServicio.getcategories';
import getSubCategories from '@salesforce/apex/DSALES_ClasificacionServicio.getSubCategories';
import getClases from '@salesforce/apex/DSALES_ClasificacionServicio.getClases';
import getFamilias from '@salesforce/apex/DSALES_ClasificacionServicio.getFamilias';
import getPickListTipoProducto from '@salesforce/apex/DSALES_ClasificacionServicio.getPickListValuesIntoList1';
import getPickListTipoServicio from '@salesforce/apex/DSALES_ClasificacionServicio.getPickListValuesIntoList2';
import getPickListTipoSeguro from '@salesforce/apex/DSALES_ClasificacionServicio.getPickListValuesIntoList4';
import getPickListMatriz from '@salesforce/apex/DSALES_ClasificacionServicio.getPickListValuesIntoList3';
import getMatrices from '@salesforce/apex/DSALES_ClasificacionServicio.getMatriz'; 
import getBuscarVinculacion from '@salesforce/apex/DSALES_ClasificacionServicio.getBuscarVinculacion';
//Crear Producto intangible
import createProductIntan from '@salesforce/apex/DSALES_ClasificacionServicio.createProductIntan';
import departamentoProduct from '@salesforce/schema/Product2.DSALES_Categoria__c';
import upsertVinculacion from '@salesforce/apex/DSALES_ClasificacionServicio.upsertVinculacion';
import getBuscarProducto from '@salesforce/apex/DSALES_ClasificacionServicio.getBuscarProducto';
import createVinculacion from '@salesforce/apex/DSALES_ClasificacionServicio.createVinculacion';
import getidservicio from '@salesforce/apex/DSALES_ClasificacionServicio.getidservicio';
import insertVinculacion from '@salesforce/apex/DSALES_ClasificacionServicio.insertVinculacion';
import updateMatriz from '@salesforce/apex/DSALES_ClasificacionServicio.updateMatriz';




const columns = [
    { label: 'Nombre', fieldName: 'etiqueta' }

];

export default class DSALES_ClasificacionServiciolwc extends LightningElement {
    @track data = {};
    @track pickList= {};
    @track asignacion= {};
    @track label= {};
    columns = columns;
    checkCategoria = false;
    checkSubCategoria = false;
    checkSku = false;
    checkSkus= false;
    checkClase = false;
    checkFamilia = false;
    showSpinner = true;
    popServicios = false;
    show = false;
    show2 = false;
    showc=false;
    showVincuProduct = false;
    showCrearIntangible = false;
    showasignarSubCategorias= false;
    showasignarClases= false;
    showasignarFamilias=false;
    buscarCategoria='';
    buscarSCat='';
    buscarClase='';
    buscarFami='';
    buscarSkuString='';
    buscarServicio='';
    showPorcentajeCobro = false;
    openTablaResultado= false;
    openTableVincProduct = false;
    showConfirmarDesvincular= false
    showConfirmarVincular= false;
    //
    ValueCategoriaSelected = departamentoProduct;
    ValueSubCategoriaSelected = '';
    resultPerfil = false;
   
    



    connectedCallback() {
        this.init();
    }


    init(){
        

        getCategoria()
        .then(result => {
            this.data = result;
            this.showSpinner = false;
            this.showc=true;

        })
        .catch(error => {
            this.showSpinner = false;
        });  
        
        this.show = false;
        this.show2 = false;
        this.show3 = false;
        this.checkCategoria = false;
        this.checkSubCategoria = false;
        this.checkClase = false;
        this.checkFamilia = false;
    }

    changeSku(event){   
        this.buscarSkuString = event.target.value;
    }
    buscarSku(){
        this.showSpinner = true;
        getSku({sku: this.buscarSkuString})
        .then(result => {
            this.data.listServicios = result;
            this.showSpinner = false;
            if(this.data.listServicios.length > 0){
                this.popServicios = true;
                this.recordServicio();
            }else{
                this.pushMessage('Advertencia', 'warning', 'No se han encontrado productos.');
            }
        }).catch(error => {
            this.showSpinner = false;
        });

    }
 
    buscadorC(event){
        this.buscarCategoria = event.target.value;
        this.buscarCategoria = this.quitaAcento(this.buscarCategoria);
        if(this.buscarCategoria.length > 2){
            for (let i = 0; i < this.data.listCategorias.length; i++){
                let etiqueta = this.quitaAcento(this.data.listCategorias[i].etiqueta);
                this.data.listCategorias[i].mostrar = etiqueta.includes(this.buscarCategoria);
            }
        }else{
            for (let i = 0; i < this.data.listCategorias.length; i++){
                this.data.listCategorias[i].mostrar = true;
            }
        }
    }

    buscadorSubC(event){
        this.buscarSCat = event.target.value;
        this.buscarSCat = this.quitaAcento(this.buscarSCat);
        if(this.buscarSCat.length > 2){
            for (let i = 0; i < this.data.listSubCategorias.length; i++){
                let etiqueta = this.quitaAcento(this.data.listSubCategorias[i].etiqueta);
                this.data.listSubCategorias[i].mostrar = etiqueta.includes(this.buscarSCat);
            }
        }else{
            for (let i = 0; i < this.data.listSubCategorias.length; i++){
                this.data.listSubCategorias[i].mostrar = true;
            }
        }
    }

    buscadorCla(event){
        this.buscarClase = event.target.value;
        this.buscarClase = this.quitaAcento(this.buscarClase);
        if(this.buscarClase.length > 2){
            for (let i = 0; i < this.data.listClases.length; i++){
                let etiqueta = this.quitaAcento(this.data.listClases[i].etiqueta);
                this.data.listClases[i].mostrar = etiqueta.includes(this.buscarClase);  
            }
        }else{
            for (let i = 0; i < this.data.listClases.length; i++){
                this.data.listClases[i].mostrar = true;
            }
        }
    }

    buscadorFami(event){
        this.buscarFami = event.target.value;
        this.buscarFami = this.quitaAcento(this.buscarFami);
        if(this.buscarFami.length > 2){
            for (let i = 0; i < this.data.listFamilias.length; i++){
                let etiqueta =this.quitaAcento(this.data.listFamilias[i].etiqueta);
                this.data.listFamilias[i].mostrar = etiqueta.includes(this.buscarFami);
            }
        }else{
            for (let i = 0; i < this.data.listFamilias.length; i++){
                this.data.listFamilias[i].mostrar = true;
            }
        }
    }


    quitaAcento(cadena){
        cadena = cadena.toUpperCase();
        cadena = cadena.replace('Á', 'A');
        cadena = cadena.replace('É', 'E');
        cadena = cadena.replace('Í', 'I');
        cadena = cadena.replace('Ó', 'O');
        cadena = cadena.replace('Ú', 'U');
        return cadena;
    }
    mostrarSubcategoria(){
        this.show= true;
        this.cargarPickList();
    }

    mostrarClase(){
        this.show2= true;
        this.cargarPickList();
    }

    mostrarFamilia(){
        this.show3= true;
        this.cargarPickList();
    }


    cargarPickList(){
        this.showSpinner = true;
        SendCat({allData: JSON.stringify(this.data)})
        .then(result => {
            this.data = result;
            this.showSpinner = false;
        }).catch(error => {
            this.showSpinner = false;
        });
    }

    onclickCategoria(event){
        let x = false;
        const valor = event.target.name;
        const check = event.target.checked;
        for (let i = 0; i < this.data.listCategorias.length; i++){           
            if(valor == this.data.listCategorias[i].valor){
                this.data.listCategorias[i].seleccionado = check ;
            }
            if(this.data.listCategorias[i].seleccionado){
                x = true;
                this.checkCategoria = true;
            }        
        }
        if(x == false){
            this.checkCategoria = false;
        }
    }

    onclickSubCategoria(event){  
        let x = false;
        const valor = event.target.name;
        const check = event.target.checked;
        for (let i = 0; i < this.data.listSubCategorias.length; i++){           
            if(valor == this.data.listSubCategorias[i].valor){
                this.data.listSubCategorias[i].seleccionado = check ;
            }
            if(this.data.listSubCategorias[i].seleccionado){
                x = true;
                this.checkSubCategoria = true;
            }        
        }
        if(x == false){
            this.checkSubCategoria = false;
        }
    }

    onclickListFamilias(event){
        let x = false;
        const valor = event.target.name;
        const check = event.target.checked;
        for (let i = 0; i < this.data.listFamilias.length; i++){           
            if(valor == this.data.listFamilias[i].valor){
                this.data.listFamilias[i].seleccionado = check ;
            }
            if(this.data.listFamilias[i].seleccionado){
                x = true;
                this.checkFamilia = true;
            }        
        }
        if(x == false){
            this.checkFamilia = false;
        }
    }

    onclicklistClases(event){
        let x = false;
        const valor = event.target.name;
        const check = event.target.checked;
        for (let i = 0; i < this.data.listClases.length; i++){           
            if(valor == this.data.listClases[i].valor){
                this.data.listClases[i].seleccionado = check ;
            }
            if(this.data.listClases[i].seleccionado){
                x = true;
                this.checkClase = true;
            }        
        }
        if(x == false){
            this.checkClase = false;
        }
    }
    
    selectAllCategoria(event){      
        const check = event.target.checked;
        for (let i = 0; i < this.data.listCategorias.length; i++){            
            this.data.listCategorias[i].seleccionado = check ;               
        }
        this.checkCategoria = check;
    }

    selectAllSubCategoria(event){      
        const check = event.target.checked;
        for (let i = 0; i < this.data.listSubCategorias.length; i++){            
            this.data.listSubCategorias[i].seleccionado = check ;               
        }
        this.checkSubCategoria = check;
    }

    selectAllFamilia(event){      
        const check = event.target.checked;
        for (let i = 0; i < this.data.listFamilias.length; i++){            
            this.data.listFamilias[i].seleccionado = check ;               
        }
        this.checkFamilia = check;
    }

    selectAllClase(event){      
        const check = event.target.checked;
        for (let i = 0; i < this.data.listClases.length; i++){            
            this.data.listClases[i].seleccionado = check ;               
        } 
        this.checkClase = check;
    }

    search(){
        this.showSpinner = true;
        getRecords({allData: JSON.stringify(this.data)})
        .then(result => {
            this.showSpinner = false;
            this.data = result;
            this.data.registroSeguro = false;
            this.data.registroServicio = false;
            if(this.data.listServicios.length > 0){
                this.popServicios = true;
                this.recordServicio();
            }else{
                this.pushMessage('Advertencia', 'warning', 'No se han encontrado productos.');
            }
        })
        .catch(error => {
            this.showSpinner = false;
            this.pushMessage('Error', 'error', 'Ha ocurrido un error, por favor contacte su administrador.');
        });
    }

    guardar(){
        this.showSpinner = true;
        this.popServicios = false;
        upsertRecord({allData: JSON.stringify(this.data)})
        .then(result => {
            this.cancelar();
            this.pushMessage('Exitoso', 'success', 'Datos guardados exitosamente.');
        }).catch(error => {
            this.showSpinner = false;
            this.pushMessage('Error', 'error', 'Ha ocurrido un error al actualizar los registros.');
        });
    }

    cancelar(){
        this.popServicios = false;
        this.showSpinner = false;
        this.showVincuProduct = false;
        this.showCrearIntangible = false;
        this.openTablaResultado= false;
        this.ValueCategoriaSelected= '';
        this.pickList.ValueClasesSelected='';
        this.pickList.ValuefamiliasSelected='';
        this.pickList.aplicaCobro= false;
        this.pickList.porcentajeCobro= 0;
        this.pickList.valueSelectedMatriz='';
        this.pickList.Description= '';
        this.pickList.Name= '';
        this.pickList.StockKeepingUnit= '';
        this.pickList.valueSelectedtipoSeguroServicio='';

    }

    limpiarCampos(){
        this.ValueCategoriaSelected='';
        this.pickList.ValueClasesSelected='';
        this.pickList.ValuefamiliasSelected='';
        this.pickList.aplicaCobro= false;
        this.pickList.porcentajeCobro= 0;
        this.pickList.valueSelectedMatriz='';
        this.pickList.Description= '';
        this.pickList.Name= '';
        this.pickList.StockKeepingUnit= '';
        this.pickList.valueSelectedtipoSeguroServicio='';
    }

    onchangeSeguro(event){
        const name = event.target.name;
        const check = event.target.checked;
        for(let i=0; i<this.data.listServicios.length; i++){
            if(this.data.listServicios[i].id == name){
                this.data.listServicios[i].seguro = check;
                this.asignarTipoServicio(i);
            }
        }
        this.recordServicio();
    }
    onchangeNoAplica(event){
        const name = event.target.name;
        const check = event.target.checked;
        for(let i=0; i<this.data.listServicios.length; i++){
            if(this.data.listServicios[i].id == name){
                this.data.listServicios[i].noAplica = check;
                //this.asignarTipoServicio(i);
            }
        }
        this.recordServicio();
    }
    onchangeAllSeguro(event){
        this.data.registroSeguro = event.target.checked;
        for(let i=0; i<this.data.listServicios.length; i++){
            this.data.listServicios[i].seguro = this.data.registroSeguro;
            this.asignarTipoServicio(i);
        }
        this.recordServicio();
    }

    onchangeAllNoAplica(event){
        this.data.noAplica = event.target.checked;
        for(let i=0; i<this.data.listServicios.length; i++){
            this.data.listServicios[i].noAplica = this.data.noAplica;
            //this.asignarTipoServicio(i);
        }
        this.recordServicio();
    }

    onchangeServicio(event){
        const name = event.target.name;
        const check = event.target.checked;
        for(let i=0; i<this.data.listServicios.length; i++){
            if(this.data.listServicios[i].id == name){
                this.data.listServicios[i].servicio = check;
                this.asignarTipoServicio(i);
            }
        }
        this.recordServicio();
    }

    onchangeAllServicio(event){
        this.data.registroServicio = event.target.checked;
        for(let i=0; i<this.data.listServicios.length; i++){
            this.data.listServicios[i].servicio = this.data.registroServicio;
            this.asignarTipoServicio(i);
        }
        this.recordServicio();
    }

    asignarTipoServicio(index){
        if(this.data.listServicios[index].servicio && this.data.listServicios[index].seguro){
            this.data.listServicios[index].tipoServicio = "3";
        }else if(this.data.listServicios[index].servicio){
            this.data.listServicios[index].tipoServicio = "2";
        }else if(this.data.listServicios[index].seguro){
            this.data.listServicios[index].tipoServicio = "1";
        }else{
            this.data.listServicios[index].tipoServicio = "0";
        }
    }

    recordServicio(){
        this.data.registroSeguro = false;
        this.data.registroServicio = false;
        this.data.noAplica = false;
        for(let i=0; i<this.data.listServicios.length; i++){
            if(this.data.listServicios[i].seguro){
                this.data.registroSeguro = true;
            }
            if(this.data.listServicios[i].servicio){
                this.data.registroServicio = true;
            }
            if(this.data.listServicios[i].noAplica){
                this.data.noAplica = true;
            }
        }
    }
    pushMessage(title,variant,msj){
        const message = new ShowToastEvent({
            "title": title,
            "variant": variant,
            "message": msj
            });
            this.dispatchEvent(message);
    }

    openVincuProduct(){
        this.showVincuProduct = true;
    }

    openVincuProductWithService(){
        this.data.nombreServicio=this.buscarServicio;
        this.showVincuProduct = true;
    }
    openFormIntangible(event){
        this.data.servicioavincular=this.buscarServicio;
        this.showCrearIntangible = true;
        this.buscarServicio= '';
 
        this.SelectSeguroServicio();
        this.getPickList1(); 
        this.limpiarCampos();
    }

    getPickList1()
    {
        getPickListTipoProducto()
        .then(result => {
            this.pickList.tipoProducto = result;
            console.log(result);
        }); 
    }

    getPickList2(event)
    {
        this.label.labelTipoServicio='Tipo de servicio';
        this.label.labelSku= 'SKU del servicio';
        this.label.labelDescripcion= 'Descripcion';
        this.label.labelName= 'Nombre del servicio';
        getPickListTipoServicio()
        .then(result => {
            this.pickList.tipoSeguroServicio = result;
        });  
    }

    getPickList3()
    {
        getPickListMatriz()
        .then(result => {
            this.pickList.Matriz = result;
        }); 
    }

    getPickList4()
    {
        this.label.labelTipoServicio= 'Tipo de seguro';
        this.label.labelSku= 'SKU del seguro';
        this.label.labelDescripcion= 'Descripcion';
        this.label.labelName= 'Nombre del seguro';
        getPickListTipoSeguro()
        .then(result => {
            this.pickList.tipoSeguroServicio = result;
        }); 
    }

    SelectSeguroServicio(){
        
        this.ProfileChecker();
      
    }

    asignarCategoria(event){
        console.log(this.pickList.valueSelectedtipoProducto);
        this.showSpinner=true;
        this.pickList.valueSelectedtipoSeguroServicio= event.target.value; 
        if(this.pickList.valueSelectedtipoSeguroServicio== 'Garantía Extendida')
        {
             this.pickList.DSALES_ServEspecifico__c = event.target.value;
              
        }
        else if( this.pickList.valueSelectedtipoSeguroServicio== 'Seguro de Motos')
        {
            this.pickList.DSALES_SegEspecifico__c = event.target.value;
        }

        getCategories({recordName: this.pickList.valueSelectedtipoSeguroServicio})
        .then(result => {
            this.pickList.listCategorias = result;
            console.log(result);
            console.log(this.data.recordid);
            this.showSpinner=false;
        });
    }
    asignarSubCategorias(event){
        this.showSpinner=true;
        this.ValueCategoriaSelected= event.target.value;
        this.showasignarSubCategorias = true;
        getSubCategories({valueCategoria: this.ValueCategoriaSelected })
        .then(result => {
            this.pickList.listSubCategorias = result;
            console.log(result);
            this.showSpinner=false;

        });

    }

    asignarClase(event){
        this.showSpinner=true;
        this.ValueCategoriaSelected= event.target.value;
        this.pickList.DSALES_Categoria__c = event.target.value;
        this.showasignarClases = true;
        getClases({valueCategoria: this.ValueCategoriaSelected })
        .then(result => {
            this.pickList.listClases = result;
            console.log(result);
        });

    }

    asignarFamilas(event){
        this.showSpinner=true;
        this.pickList.ValueClasesSelected= event.target.value;
        this.pickList.DSALES_Clase__c = event.target.value;
        this.showasignarFamilias = true;
        getFamilias({valueClases: this.pickList.ValueClasesSelected })
        .then(result => {
            this.pickList.listFamilias = result;
            console.log(result);
        });

    }

    asignarMatriz(event){
        this.showSpinner=true;
        this.pickList.Valuefamilias= event.target.value;
        this.pickList.DSALES_Familia__c= event.target.value;
        getMatrices({valuefamilias: this.pickList.Valuefamilias})
        .then(result => {
            this.pickList.listMatrices = result;
            this.showSpinner=false;
            console.log(result);
        });

    }

    ProfileChecker(event){
        getProfileType({profile: 'Administrador SM'})
        .then(result => {
            this.data.confirmarProfileType= result;
            console.log(result+'jaja');
            if(this.data.confirmarProfileType=='Administrador SM'&& this.data.confirmarProfileType!='Administrador del sistema')
            {
                this.resultPerfil=true;
                this.pickList.valueSelectedtipoProducto = 'Seguro';
                this.pickList.DSales_Tipo_de_Producto__c= 'Seguro';
                console.log('entro sm')   
            }
            else if(this.data.confirmarProfileType=='No corresponde'&& this.data.confirmarProfileType!='Administrador del sistema')
            {
                this.resultPerfil=false; 
                this.pickList.valueSelectedtipoProducto = 'Servicio';
                this.pickList.DSales_Tipo_de_Producto__c= 'Servicio';
                console.log('entro gex') 
            }
            if(this.data.confirmarProfileType=='Administrador SM')
            {
                this.getPickList4(event);
                
            }
            else 
            {
                this.getPickList2(event); 
                console.log('es gex')
            }  
        })
        
        .catch(error => {
            this.showSpinner = false;
        });  
    }

    buscarAsignacionVinculacion(event){
        this.data.asignacion=event.target.value;
    }

    handleInputChangeSku(event) {
        this.pickList.StockKeepingUnit = event.detail.value;
        console.log("Sku", this.pickList.StockKeepingUnit)
    }
    handleInputChangeNameSS(event) {
        this.pickList.Name = event.detail.value;
        console.log("Name", this.pickList.Name)
    }
    handleInputChangeDescription(event) {
        this.pickList.Description = event.detail.value;
        console.log("Descripcion", this.pickList.Description)
    }

    openPorcentajeCobro(event) {
        
        const checkpc= event.target.checked;
        if(checkpc)
        {
            this.showPorcentajeCobro = true;
            this.pickList.DSales_Aplicaporcentajecobro__c = true;
            
        }
        else 
        {this.showPorcentajeCobro = false;
        this.pickList.DSales_Aplicaporcentajecobro__c = false;
        }
        this.pickList.aplicaCobro = checkpc;
        
    }

    onChangePorcentajeCobro(event) {
        this.pickList.DSales_PorcentajeCobro__c = event.target.value;
    }

    onchangeValueMatriz(event){
        /* this.pickList.DSALES_Matriz__c =event.detail.value; */
        this.pickList.matrizSelected = event.detail.value;
        console.log(JSON.parse(JSON.stringify(this.pickList.matrizSelected)));
        
    }

    confirmarGuardar(){
        this.data.confirmarGuardar=false; 
        if(   this.ValueCategoriaSelected== ''||
        this.pickList.ValueClasesSelected=='' ||
       // this.pickList.ValuefamiliasSelected=='' ||
        this.pickList.Description== '' ||
        this.pickList.Name== '' ||
        this.pickList.StockKeepingUnit== '' 
        )
        {
            this.pushMessage('Advertencia', 'warning', 'Existen campos vacios o no seleccionados');  
        }
        else{
            this.guardarProductIntan();
            this.data.confirmarGuardar=true; 
        }

    }

    guardarProductIntan(){


        createProductIntan({productIntan : this.pickList}
            ).then(result => {
                this.message = result.message;
                this.error= undefined;
                if (this.message !== undefined) {
                    this.dispatchEvent(
                        this.pushMessage('Error al guardar', 'Warning', 'Error al crear record')
                       
                    );
                
                }

                this.pushMessage('Guardado', 'success', 'Producto guardado exitosamente.')
                getidservicio({servicio: this.pickList.Name})
                  .then(result => {
                    this.data.idservicio = result;
                    this.showSpinner = false;
                    console.log(result);

                     updateMatriz({allData:JSON.stringify(this.pickList.matrizSelected), tipoServicio: result})
                     .then(result => {

        
                     }).catch(error => {
                         this.showSpinner = false;
                         this.pushMessage('Error', 'error', 'Ha ocurrido un error al actualizar las matrices.');
                         
                     });


                   }).catch(error => {
                  console.log(error);
                   this.showSpinner = false;
                   });
                console.log(JSON.stringify(result))
                console.log("result", this.message)
            })
            .catch(error =>{
                this.message =undefined;
                this.error = error;
                this.dispatchEvent(
                    this.pushMessage('Error al guardar', 'Warning', 'Error al crear record')
                );
                console.log("error", JSON.stringify(this.error))
            });

            this.showCrearIntangible = false  
            
        }

        guardarAsignacion(){

            insertVinculacion({dataJSON:JSON.stringify(this.data.listaproductos), idservicio: this.data.idservicio})
            .then(result => {
                this.pushMessage('Exitoso', 'success', 'Datos guardados exitosamente.');
                this.onClickBuscarIntanProduct();

            }).catch(error => {
                this.showSpinner = false;
                this.pushMessage('Error', 'error', 'Ha ocurrido un error al actualizar los registros.');
                console.log(error)

            });
            /*createVinculacion({asignacion : this.data}
                ).then(result => {
                    this.message = result.message;
                    this.error= undefined;
                    if (this.message !== undefined) {
                        this.dispatchEvent(
                            this.pushMessage('Error al guardar', 'Warning', 'Error al crear record')
                           
                        );
                    
                    }
                    this.pushMessage('Guardado', 'success', 'Producto guardado exitosamente.')
                    console.log(JSON.stringify(result))
                    console.log("result", this.message)
                })
                .catch(error =>{
                    this.message =undefined;
                    this.error = error;
                    this.dispatchEvent(
                        this.pushMessage('Error al guardar', 'Warning', 'Error al crear record')
                    );
                    console.log("error", JSON.stringify(this.error))
                });
    
                this.showCrearIntangible = false*/  
                
                this.showConfirmarVincular= false;
                this.openTableVincProduct = false;
                
        }
        onClickBuscarIntanProduct(){
            this.showSpinner = true;
            this.getidserviciostring();
            if (this.buscarServicio === '') {
                this.buscarServicio = this.pickList.Name;  
            }
            console.log(this.buscarServicio);
            getBuscarVinculacion({servicio: this.buscarServicio})
            .then(result => {
                this.data.listasignacion = result;
                this.error= undefined;
                this.showSpinner = false;
                console.log(result); 
                if(this.data.listasignacion.length > 0){
                    this.openTablaResultado= true;
                }else if(this.data.listasignacion.length < 1){
                    this.pushMessage('Advertencia', 'warning', 'No se han encontrado Asignaciones, Crea una.');
                    this.openTablaResultado= true;
                }
                
            }).catch(error => {
                 console.log(error);
                 this.pushMessage('Advertencia', 'warning', 'Este Servicio no existe.');
                this.showSpinner = false;
            }); 

            
    

        }

        getidserviciostring(){
            getidservicio({servicio: this.buscarServicio})
            .then(result => {
                this.data.idservicio = result;
                this.showSpinner = false;
                console.log(result)
            }).catch(error => {
                console.log(error);
                this.showSpinner = false;
            }); 

        }
        onChangeInputBuscarServicio(event) {
            this.buscarServicio = event.target.value;
           // console.log( this.buscarServicio);
        }

        

        cancelar2(){
            this.openTablaResultado= false;
    
        }

        selectAllSku(event){      
            const check = event.target.checked;
            for (let i = 0; i < this.data.listasignacion.length; i++){            
                this.data.listasignacion[i].seleccionadoSku = check;
                this.data.listasignacion[i].seleccionadoDept = check; 
                this.data.listasignacion[i].seleccionadoClase = check;
                this.data.listasignacion[i].seleccionadoFamilia = check;              
            }
            this.checkSku = check;
        }

        updateVinculacion(){
            console.log(JSON.parse(JSON.stringify(this.data.listasignacion)));
            upsertVinculacion({dataJSON: JSON.stringify(this.data.listasignacion)})
            .then(result => {
                this.pushMessage('Exitoso', 'success', 'Datos guardados exitosamente.');
                this.onClickBuscarIntanProduct();
            }).catch(error => {
                this.showSpinner = false;
                this.pushMessage('Error', 'error', 'Ha ocurrido un error al actualizar los registros.');
                console.log(error)
            });

           
            this.showConfirmarDesvincular= false;
        }

      /*   OnCkickDepartament(event){
            this.data.checkCategoria2 = event.target.label
            

            this.search2()
        }




        


        
        search2(){
        this.showSpinner = true;
        getRecords({allData: JSON.stringify(this.data)})
        .then(result => {
            this.showSpinner = false;
            this.data = result;
            this.data.registroSeguro = false;
            this.data.registroServicio = false;
            if(this.data.listServicios.length > 0){
                this.popServicios = true;
                this.recordServicio();
            }else{
                this.pushMessage('Advertencia', 'warning', 'No se han encontrado productos.');
            }
        })
        .catch(error => {
            this.showSpinner = false;
            this.pushMessage('Error', 'error', 'Ha ocurrido un error, por favor contacte su administrador.');
        });
    }
 */
    selectAllSkuSelected(event){  
        this.data.checkDepartamento = false;
        const check1 = event.target.checked;
        const checkDept = event.target.label; 
        for (let i = 0; i < this.data.listasignacion.length; i++){    
             if (this.data.listasignacion[i].sku===checkDept){
                this.data.listasignacion[i].seleccionadoSku = check1;
             }
            
        }
        this.checkDepartamento = check1;             
    }

    selectAllDepartamentos(event){  
        this.data.checkDepartamento = false;


        const check1 = event.target.checked;
        const checkDept = event.target.label; 
        console.log(checkDept)
        for (let i = 0; i < this.data.listasignacion.length; i++){    
             if (this.data.listasignacion[i].departamento===checkDept){
                this.data.listasignacion[i].seleccionadoDept = check1;
                this.data.listasignacion[i].seleccionadoSku = check1;
             }
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }
    
        this.checkDepartamento = check1;
       
        
    }


    selectAllClases(event){  
        this.data.checkClase = false;

        const check2 = event.target.checked;
        const checkClass = event.target.label; 
        console.log(checkClass)
        for (let i = 0; i < this.data.listasignacion.length; i++){  
             if (this.data.listasignacion[i].clase===checkClass){
                this.data.listasignacion[i].seleccionadoClase = check2;
                this.data.listasignacion[i].seleccionadoDept = check2;
                this.data.listasignacion[i].seleccionadoSku = check2;
               /* if (this.data.listasignacion[i].clase===checkClass && this.data.listasignacion[i].seleccionadoDept) {
                    this.data.listasignacion[i].seleccionadoSku = check2;
                    
                    
                }*/
                
             }
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }
    
        this.checkClase = check2;
       
        
    }


    selectAllFamilias(event){  
        this.data.checkfamilia = false;

        const check3 = event.target.checked;
        const checkFam = event.target.label; 
    
        for (let i = 0; i < this.data.listasignacion.length; i++){   
             if (this.data.listasignacion[i].familia===checkFam){
                this.data.listasignacion[i].seleccionadoClase = check3;
                this.data.listasignacion[i].seleccionadoDept = check3;
                this.data.listasignacion[i].seleccionadoSku = check3;
                this.data.listasignacion[i].seleccionadoFamilia = check3;
               /* if (this.data.listasignacion[i].clase===checkClass && this.data.listasignacion[i].seleccionadoDept) {
                    this.data.listasignacion[i].seleccionadoSku = check2;
                    
                    
                }*/
                
             }
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }
    
        this.data.checkFamilia = check3;
       
        
    }


    //aqui es respecto a producto
    selectAllSkusProducto(event){      
        const checkP = event.target.checked;
        for (let i = 0; i < this.data.listaproductos.length; i++){            
            this.data.listaproductos[i].seleccionadoSku = checkP;
            this.data.listaproductos[i].seleccionadoClase = checkP;
            this.data.listaproductos[i].seleccionadoDept = checkP;
            this.data.listaproductos[i].seleccionadoFamilia = checkP;               
        }
        this.checkSkus = checkP;
    }


    selectAllSkuProducto(event){  
        this.data.checkSku = false;
        this.data.listSku= event.target.label; 
        const check1 = event.target.checked; 
      
        for (let i = 0; i < this.data.listaproductos.length; i++){    
             if (this.data.listaproductos[i].sku===this.data.listSku){
                this.data.listaproductos[i].seleccionadoSku = check1;
             } 
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }
        this.checkDepartamento = check1;
       
        
    }


    selectAllDepartamentosProducto(event){  
        this.data.checkDepartamento = false;
        this.data.DSALES_Departamento__c= event.target.label; 
        const check1 = event.target.checked; 
       
        for (let i = 0; i < this.data.listaproductos.length; i++){    
             if (this.data.listaproductos[i].departamento===this.data.DSALES_Departamento__c){
                this.data.listaproductos[i].seleccionadoDept = check1;
                this.data.listaproductos[i].seleccionadoSku = check1;
             } 
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }

        this.checkDepartamento = check1;
       
        
    }
 

    selectAllClasesProducto(event){  
        this.data.checkClase = false;
        const check2 = event.target.checked;
        this.data.DSALES_Clase__c= event.target.label;  
        for (let i = 0; i < this.data.listaproductos.length; i++){  
             if (this.data.listaproductos[i].clase===this.data.DSALES_Clase__c){
                this.data.listaproductos[i].seleccionadoClase = check2;
                this.data.listaproductos[i].seleccionadoDept = check2;
                this.data.listaproductos[i].seleccionadoSku = check2;
               /* if (this.data.listasignacion[i].clase===checkClass && this.data.listasignacion[i].seleccionadoDept) {
                    this.data.listasignacion[i].seleccionadoSku = check2;
                    
                    
                }*/
                
             }
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }
        this.checkClase = check2;
       
        
    }


    selectAllFamiliasProducto(event){  
      
        this.data.checkfamilia = false;
        const check3 = event.target.checked;
        this.data.DSALES_Familia__c= event.target.label; 
    
        for (let i = 0; i < this.data.listaproductos.length; i++){   
             if (this.data.listaproductos[i].familia===this.data.DSALES_Familia__c){
                this.data.listaproductos[i].seleccionadoClase = check3;
                this.data.listaproductos[i].seleccionadoDept = check3;
                this.data.listaproductos[i].seleccionadoSku = check3;
                this.data.listaproductos[i].seleccionadoFamilia = check3;
                this.data.DSALES_Departamento__c= this.data.listaproductos[i].departamento;
                this.data.DSALES_Clase__c= this.data.listaproductos[i].clase;
                this.data.DSALES_SKU__c= this.data.listaproductos[i].sku;
                this.data.DSALES_Servicio_Seguro__c= this.data.listaproductos[i].id;
               /* if (this.data.listasignacion[i].clase===checkClass && this.data.listasignacion[i].seleccionadoDept) {
                    this.data.listasignacion[i].seleccionadoSku = check2;   
              }*/
                
             }
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }
        this.data.checkFamilia = check3;
       
        
    }
      
    skuSelected(event){  
        this.data.checkfamilia = false;

        const check3 = event.target.checked;
        const checkFam = event.target.label; 
    
        for (let i = 0; i < this.data.listasignacion.length; i++){    
             if (this.data.listasignacion[i].seleccionadoSku===true){
                this.data.listSkuSelected= this.data.listasignacion[i].sku;
                
             }
        /* this.data.listasignacion[i].seleccionadoDept = check1;
            console.log(checkDept);   */
            
        }
    console.log(this.data.listSkuSelected);
        this.data.checkFamilia = check3;
       
        
    }   


    vincularNuevoServicio(){
        getidservicio({servicio: this.pickList.Name})
            .then(result => {
                this.data.idservicio = result;
                this.showSpinner = false;
                console.log(result)
                this.buscarProductsNoVinc();
            }).catch(error => {
                console.log(error);
                this.showSpinner = false;
            });
        console.log(this.data.listaproductos);
        this.data.confirmarGuardar=false;
        this.showVincuProduct=true;
        this.openTablaResultado=true;
        console.log(this.data.idservicio);
        
    }
    buscarProductsNoVinc(){
     
        getBuscarProducto({servicio: this.data.idservicio})
        .then(result => {
            this.data.listaproductos = result;
            this.showSpinner = false;
            console.log(result)
            if(this.data.listaproductos.length > 0){
                this.openTableVincProduct= true;
            }else{
                this.pushMessage('Advertencia', 'warning', 'No se han encontrado productos.');
                this.onClickBuscarIntanProduct();
            }
        }).catch(error => {
            console.log(error);
            this.showSpinner = false;
        }); 


        }
    
    
    cancelar3(){
        this.openTableVincProduct = false;
    
        }

    openEmergenteDesvincular(){

            for (let i = 0; i < this.data.listasignacion.length; i++){    
                if (this.data.listasignacion[i].seleccionadoSku===true){ 
                    this.showConfirmarDesvincular= true;
                }    
            }
            
        }
    
    cancelar4(){
        this.showConfirmarDesvincular= false;
        this.data.confirmarGuardar = false;
        this.limpiarCampos();
        
        }

        openEmergenteVincular(){

            for (let i = 0; i < this.data.listaproductos.length; i++){    
                if (this.data.listaproductos[i].seleccionadoSku===true){ 

                    this.showConfirmarVincular= true;
                }    
            }
            
        }
    
    cancelar5(){
        this.showConfirmarVincular= false;
        
        }
 
    
    //se guardo correctamente 8:44 Hora colombia
    
    

    

    
    

    
   
    
}