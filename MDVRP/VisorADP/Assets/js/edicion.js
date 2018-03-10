var _estados = { "pendiente": 0, "pago": 1, "notificado":2, "nocalculado":3, "calculado": 4, "pedidopresc": 5};
var _leyenda = { "bajo": 0, "medio": 1, "alto": 2 };

function estadoStr(estado) {

    switch (estado) {

        case _estados["pendiente"]: return "PENDIENTE"; break;
        case _estados["pago"]: return "PAGO"; break;
        case _estados["notificado"]: return "NOTIFICADO"; break;
        case _estados["nocalculado"]: return "NO CALCULADO"; break;
        case _estados["calculado"]: return "CALCULADO"; break;
    }
}

function cargasEnComun() {
    _imageParameters = new ImageParameters();
    _imageParameters.layerIds = [0];
    _imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
    _imageParameters.transparent = true;

    _infoTemplatesAmbiente = {
        0: {
            infoTemplate: new InfoTemplate(function () { return getLayerName("AMBIENTE") }, cargarAmbienteInfoTemplate)
        }
    };
    _infoTemplatesPrescripcion = {
        0: {
            infoTemplate: new InfoTemplate(function () { return getLayerName("PRESCRIPCION") }, cargarPrescripcionInfoTemplate)
        }
    };
    _infoTemplatesProductor = {
        0: {
            infoTemplate: new InfoTemplate(function () { return getLayerName("PRODUCTOR") }, cargarProductorInfoTemplate)
        }
    };


    consultarElementosPendientes();

}

/*INI PRODUCTOR*/

function cargarProductor() {

    _geometryService = new GeometryService(URL_Servicio_GeometryService);
    _geometryService.on("areas-and-lengths-complete", outputAreaAndLength);

    /*CARGO LAS CAPAS PRODUCTOR AMBIENTE Y PRESCRIPCION COMO ArcGISDynamicMapServiceLayer*/
    _dicMapServerLayers["AMBIENTE"]=new ArcGISDynamicMapServiceLayer(URL_Map_ServerAmbiente, { "imageParameters": _imageParameters, "infoTemplates": _infoTemplatesAmbiente });
    _dicMapServerLayers["PRESCRIPCION"]=new ArcGISDynamicMapServiceLayer(URL_Map_ServerPrescripcion, { "imageParameters": _imageParameters, "infoTemplates": _infoTemplatesPrescripcion });
    _dicMapServerLayers["PRODUCTOR"]=new ArcGISDynamicMapServiceLayer(URL_Map_ServerProductor, { "imageParameters": _imageParameters, "infoTemplates": _infoTemplatesProductor });

 
    //CREO LEGEND
    addLayersToToc(true);

    //SETEO FILTRO
    inicializarFiltros();//inicializa la ventana para filtrar

    var layerDefinitionsProductor = [];
    layerDefinitionsProductor[0] = "idprod=" + _idUser;
    
    filtrarCapa(_dicMapServerLayers["PRODUCTOR"], layerDefinitionsProductor)

    var layerDefinitionsAmbiente= [];
    layerDefinitionsAmbiente[0] = "idprod=" + _idUser + " and estado IN (" + _estados["notificado"] + "," + _estados["pedidopresc"] + ")";

    filtrarCapa(_dicMapServerLayers["AMBIENTE"], layerDefinitionsAmbiente)

    var layerDefinitionsPrescripcion = [];
    layerDefinitionsPrescripcion[0] = "idprod=" + _idUser + " and estado=" + _estados["calculado"];
    filtrarCapa(_dicMapServerLayers["PRESCRIPCION"], layerDefinitionsPrescripcion)


    _map.addLayer(_dicMapServerLayers["PRODUCTOR"]);
    _map.addLayer(_dicMapServerLayers["AMBIENTE"]);
    _map.addLayer(_dicMapServerLayers["PRESCRIPCION"]);
    /*CARGO LAS CAPAS AMBIENTE Y PRESCRIPCION COMO ArcGISDynamicMapServiceLayer*/

    /*CREO FEATURE LAYER PARA EDITAR*/
    _dicFeaturesLayers["PRODUCTOR"]=new FeatureLayer(URL_Servicio_FeatureServiceProductor, {
        mode: FeatureLayer.MODE_ONDEMAND,
        //infoTemplate: new InfoTemplate(function () { return getLayerName("PRODUCTOR") }, cargarProductorInfoTemplate),
        outFields: ["*"]
    })    

    /*CREO FEATURE LAYER PARA EDITAR*/
   
    /*GRAFIC LAYER*/
    _editionLayer = new GraphicsLayer();
    _editionLayer.on("click", function (evt) {

        if (_panActivated) {
            var index = _editionLayer.graphics.indexOf(evt.graphic);
            setCurrent(index);
            activateToolbar(evt.graphic);
            evt.stopPropagation();
        }

    });

    if (_editionLayer)
        _map.addLayer(_editionLayer);
    /*GRAFIC LAYER*/


    $(document).on("click", "#btnRealizarPago", function () {

        realizarPago()
    });

    $(document).on("click", ".btnZoomAreaAPagar", function () {

        var geometry = _featuresPendiente[$(this).data("id")].geometry

        zoomToGeometry(geometry);
    });

    $(document).on("click", "#btnInformarPrescripcion", function () {

        enviarPrescripcion()
    });
    
}

/*INI PRODUCTOR*/

/*INI TECNICO*/

function cargarTecnico() {

    _geometryService = new GeometryService(URL_Servicio_GeometryService);
    _geometryService.on("areas-and-lengths-complete", outputAreaAndLength);

    $(document).on("click","#selectProductor .dropdown-menu li a",function () {
        
        asignarProductor($(this).data("productor"));

    });

    $(document).on("click", "#selectLeyenda .dropdown-menu li a", function () {

        asignarLeyenda($(this).html());
        //asignarProductor($(this).data("productor"));

    });


    /*CREO FEATURE LAYER PARA EDITAR*/
    _dicFeaturesLayers["AMBIENTE"] = new FeatureLayer(URL_Servicio_FeatureServiceAmbiente, {
        mode: FeatureLayer.MODE_ONDEMAND,
        //infoTemplate: new InfoTemplate(function () { return getLayerName("AMBIENTE") }, cargarAmbienteInfoTemplate),
        outFields: ["*"]
    });

    _dicFeaturesLayers["PRESCRIPCION"]=new FeatureLayer(URL_Servicio_FeatureServicePrescripcion, {
        mode: FeatureLayer.MODE_ONDEMAND,
        //infoTemplate: new InfoTemplate(function () { return getLayerName("PRESCRIPCION") }, cargarPrescripcionInfoTemplate),
        outFields: ["*"]
    })
    /*CREO FEATURE LAYER PARA EDITAR*/

    /*GRAFIC LAYER*/
    _editionLayer = new GraphicsLayer();
    _editionLayer.on("click", function (evt) {

        if (_panActivated) {
            var index = _editionLayer.graphics.indexOf(evt.graphic);
            setCurrent(index);
            activateToolbar(evt.graphic);
            evt.stopPropagation();
        }

    });
    /*GRAFIC LAYER*/



    /*CARGO LAS CAPAS AMBIENTE Y PRESCRIPCION COMO ArcGISDynamicMapServiceLayer*/
    
    _dicMapServerLayers["AMBIENTE"]=new ArcGISDynamicMapServiceLayer(URL_Map_ServerAmbiente, { "imageParameters": _imageParameters, "infoTemplates": _infoTemplatesAmbiente });
    _dicMapServerLayers["PRESCRIPCION"]=new ArcGISDynamicMapServiceLayer(URL_Map_ServerPrescripcion, { "imageParameters": _imageParameters, "infoTemplates": _infoTemplatesPrescripcion });

    //SETEO FILTRO
    inicializarFiltros();//inicializa la ventana para filtrar

    var layerDefinitions = [];
    layerDefinitions[0] = "nomtecnico='" + _userName + "'";

    filtrarCapa(_dicMapServerLayers["AMBIENTE"], layerDefinitions)
    filtrarCapa(_dicMapServerLayers["PRESCRIPCION"], layerDefinitions)

    //CREO LEGEND
    addLayersToToc(false);

    //CREO PARA QUE ELIJA LAS CAPAS AL MOMENTO DE EDITAR
    $("#modalSelectLayerToEdit").append('<input type="button" class="editionButton btn-danger" data-capa="AMBIENTE" value="' + getLayerName("AMBIENTE") + '" />')//LAS DISPONIBILIZO PARA ELEGIR CUANDO SE VA A EDITAR
    $("#modalSelectLayerToEdit").append('<input type="button" class="editionButton btn-danger" data-capa="PRESCRIPCION" value="' + getLayerName("PRESCRIPCION") + '" />')//LAS DISPONIBILIZO PARA ELEGIR CUANDO SE VA A EDITAR
 

    _map.addLayer(_dicMapServerLayers["AMBIENTE"]);
    _map.addLayer(_dicMapServerLayers["PRESCRIPCION"]);
    /*CARGO LAS CAPAS PRODUCTOR AMBIENTE Y PRESCRIPCION COMO ArcGISDynamicMapServiceLayer*/

    if (_editionLayer)
        _map.addLayer(_editionLayer);

}

/*INI TECNICO*/

/*LEGEND*/

function addLayersToToc(esProductor) {


    _toc.layerInfos.push(
            {
                layer: _dicMapServerLayers["PRESCRIPCION"],
                subLayerIds: [0],
                slider: true,
            }
        );
    _toc.layerInfos.push(
            {
                layer: _dicMapServerLayers["AMBIENTE"],
                subLayerIds: [0],
                slider: true,
            }
        );
    if (esProductor) {
        _toc.layerInfos.push(
                {
                    layer: _dicMapServerLayers["PRODUCTOR"],
                    subLayerIds: [0],
                    slider: true,
                }
         );
    }

    _toc.refresh();

}


/*LEGEND*/

/*INFO TEMPLATES*/

function getLayerName(layer) {
    var name = "";
    switch (layer) {

        case "AMBIENTE": {
            name = _layerAmbienteName;
            break;
        }
        case "PRESCRIPCION": {
            name = _layerPrescripcionName
            break;
        }
        case "PRODUCTOR": {
            name = _layerProductorName;
            break;
        }
    }

    return name;

}
function cargarProductorInfoTemplate(feature) {

    var attributes = feature.attributes;

    var sup1 = Math.round(attributes["ADP.SDE.productor.area"] * 100) / 100;

    var precio1 = Math.round(attributes.precio * 100) / 100;

    var table = "<table class='table table-bordered'>" +
                "<tbody>" +
                        "<tr class=''><td><span>Fecha: </span><input data-editable=true data-attr='fecha' type='date' value='" + formatDate(attributes.fecha) + "'></span></td></tr>"
            +
                        "<tr><td><span>Establecimiento: </span><input data-editable=true data-attr='establecimiento' type='text' value='" + attributes.establecimiento + "'></td></tr>"
            +
                        "<tr class=''><td><span>Área (ha): </span><span>" + sup1 + "</span></td></tr>"
            +
                        "<tr><td><span>Precio (US$): </span><span>" + precio1 + "</span></td></tr>"
            +
                        "<tr><td><span>Estado : </span><span>" + estadoStr(attributes.estado) + "</span></td></tr>"
            + (attributes.estado != 0 ? "" : "<tr>"//si es estado pendiente
                                            + "<td>"
                                            + "<input class='editionButton modificarFeature myRight btn-danger' type='button' value='Modificar' data-featureid='" + attributes.OBJECTID + "' data-capa=" + "PRODUCTOR" + ">"
                                            +"<input class='editionButton eliminarFeature myRight btn-danger' type='button' value='Eliminar' data-featureid='" + attributes.OBJECTID + "' data-capa=" + "PRODUCTOR" + ">"
                                            +"</td>"
                                      + "</tr>")

                + "</tbody>"
            + "</table>"
    _map.infoWindow.show(_event.mapPoint);
    return table;
}
function cargarAmbienteInfoTemplate(feature) {

    var attributes = feature.attributes;

    //si es productor y el estado es notificado pone boton de prescripcion
    
    //si es productor o (es tecnico pero el estado es notificado) no se le agregan botones de eliminar y modificar
    var sup1 = Math.round(attributes.sup * 100) / 100;
    var table = "<table class='table table-bordered'>"
                + "<tbody>"
                        + "<tr class=''><td><span>Nombre productor: </span>" + attributes.nomprod + "</span></td></tr>"
                        + "<tr class=''><td><span>Cel. productor: </span>" + attributes.celprod + "</span></td></tr>"
                        + "<tr class=''><td><span>Nombre técnico: </span>" + attributes.nomtecnico + "</span></td></tr>"
                        + "<tr class=''><td><span>Superficie: </span>" + sup1 + "</span></td></tr>"
                        + (_esProductor && attributes["estado"] == _estados["notificado"] ?
                            "<tr><td><input class='editionButton prescripcionFeature myRight btn-danger' type='button' value='Prescripción' data-featureid='" + attributes.OBJECTID + "' data-capa=" + "AMBIENTE" + " data-numero_orden=" + attributes.numero_orden  + "></tr>"
                            :"")
                        +
                        (_esProductor || attributes["estado"] == _estados["notificado"] || attributes["estado"] == _estados["pedidopresc"] ? "" :
                                            "<tr><td>"
                                                //"<input class='editionButton modificarFeature myRight btn-danger' type='button' value='Modificar' data-featureid='" + attributes.OBJECTID + "' data-capa=" + "AMBIENTE" + ">"+
                                                + "<input class='editionButton eliminarFeature myRight btn-danger' type='button' value='Eliminar' data-featureid='" + attributes.OBJECTID + "' data-capa=" + "AMBIENTE" + ">"
                                            + "</td></tr>")
                + "</tbody>"
            + "</table>"
    _map.infoWindow.show(_event.mapPoint);
    return table;
}
function cargarPrescripcionInfoTemplate(feature) {

    var attributes = feature.attributes;

    //si es productor o (es tecnico pero el estado es calculado) no es no se le agregan botones de eliminar y modificar
    var sup1 = Math.round(attributes.sup * 100) / 100;
    var table = "<table class='table table-bordered'>"
                + "<tbody>"
                        + "<tr class=''><td><span>Nombre productor: </span>" + attributes.nomprod + "</span></td></tr>"
                        + "<tr class=''><td><span>Cel. productor: </span>" + attributes.celprod + "</span></td></tr>"
                        + "<tr class=''><td><span>Nombre técnico: </span>" + attributes.nomtecnico + "</span></td></tr>"
                        + "<tr class=''><td><span>Superficie: </span>" + sup1 + "</span></td></tr>"
                        +(_esProductor || attributes["estado"] == _estados["calculado"] ? "" : 
                                                "<tr><td>"
                                                    //"<input class='editionButton modificarFeature myRight btn-danger' type='button' value='Modificar' data-featureid='" + attributes.OBJECTID + "' data-capa=" + "PRESCRIPCION" + ">"+
                                                    +"<input class='editionButton eliminarFeature myRight btn-danger' type='button' value='Eliminar' data-featureid='" + attributes.OBJECTID + "' data-capa=" + "PRESCRIPCION" + ">"
                                                +"</td></tr>")
                + "</tbody>"
            + "</table>"
    _map.infoWindow.show(_event.mapPoint);
    return table;
}

/*INFO TEMPLATES*/


/*FILTROS*/

function inicializarFiltros() {
    var mapfilters = $("#mapFilters");
    mapfilters.empty();
    if (_esProductor) {
        mapfilters.append(crearFiltros("PRODUCTOR"));
        mapfilters.append(crearFiltros("AMBIENTE"));
        mapfilters.append(crearFiltros("PRESCRIPCION"));
    }
    else {
        mapfilters.append(crearFiltros("AMBIENTE"));
        mapfilters.append(crearFiltros("PRESCRIPCION"));
    }

}

function crearFiltros(capa) {

    var filtrosCapa = "";

    filtrosCapa = '<div data-capa=' + capa + '>'
                    + '<h4>' + getLayerName(capa) + '</h4>'
                    + '<div class="filtersLayer">'
                        + (crearFiltrosCapa(capa, null))
                    + '</div>'
                + '</div>'

         
    return filtrosCapa;

}

function crearFiltrosCapa(capa, aux) {

    var filtro = "";
    switch (capa) {
        case "PRODUCTOR": {
            filtro = '<div class="divFilter">'
                    + '<span> Desde </span>'                    
                    + '<input id="btnPDesde" type="date" value="' + (aux == null ? "" : aux[0]) + '"/>'                   
                    + '</div>'
                    + '<div class="divFilter">'
                    + '<span> Hasta </span>'                   
                    + '<input style="margin-left: 4px;" id="btnPHasta" type="date" value="' + (aux == null ? "" : aux[1]) + '"/>'
                    + '</div>'
                    + "<hr>"                   
            filtro += '<div class="divFilter">'
                   + '<span> Pendiente </span>'
                   + '<input id="chPPendiente" type="checkbox" ' + (aux == null || (aux != null && aux[2]) ? "checked" : "") + '/>'
                   + '<span> Pago </span>'
                   + '<input id="chPPago" type="checkbox" ' + (aux == null || (aux != null && aux[3]) ? "checked" : "") + '/>'
                   + '<input id="btnConsultarZoom" type="button" value="Consultar y Acercar " class="editionButton btn-danger"  style="margin-left: 5px; width: 180px;" onclick="ConsultarAcercar();"/>'
                   + '</div>'
            break;
        }
        case "AMBIENTE": {
            filtro = '<div class="divFilter">'
                    + '<span> Desde </span>'
                    + '<input id="btnADesde" type="date" value="' + (aux == null ? "" : aux[0]) + '"/>'
                    + '</div>'  
                    + '<div class="divFilter">'
                    + '<span> Hasta </span>'
                    + '<input style="margin-left: 4px;" id="btnAHasta" type="date" value="' + (aux == null ? "" : aux[1]) + '"/>'
                    + '</div>'
                    + "<hr>"                   
            if (!_esProductor) {//osea si es tecnico, porque si es productor, ya ve los notificados solamente
                filtro += '<div class="divFilter">'
                       + '<span> Pago </span>'
                       + '<input id="chAPago" type="checkbox" ' + (aux == null || (aux != null && aux[2]) ? "checked" : "") + '/>'
                       + '<span> Notificado </span>'
                       + '<input id="chANotificado" type="checkbox" ' + (aux == null || (aux != null && aux[3]) ? "checked" : "") + '/>'
                       + '</div>'
            }
            break;
        }
        case "PRESCRIPCION": {
            filtro = '<div class="divFilter">'
                    + '<span> Desde </span>'
                    + '<input id="btnPreDesde" type="date" value="' + (aux == null ? "" : aux[0]) + '"/>'
                    + '</div>'
                    + '<div class="divFilter">'
                    + '<span> Hasta </span>'  
                    + '<input style="margin-left: 4px;" id="btnPreHasta" type="date" value="' + (aux == null ? "" : aux[1]) + '"/>'
                    + '</div>'
                    + "<hr>"                  
            if (!_esProductor) {//osea si es tecnico, porque si es productor, ya ve los calculados solamente
                filtro += '<div class="divFilter">'
                       + '<span> No calculado </span>'
                       + '<input id="chNoCalculado" type="checkbox" ' + (aux == null || (aux != null && aux[2]) ? "checked" : "") + '/>'
                       + '<span> Calculado </span>'
                       + '<input id="chCalculado" type="checkbox" ' + (aux == null || (aux != null && aux[3]) ? "checked" : "") + '/>'
                       + '</div>'
            }
            break;
        }

    }
    return filtro;
}

function ConsultarAcercar() {
    try {

        var valDesde = $("#btnPDesde").val();
        var valHasta = $("#btnPHasta").val();
        var estadopendiente = $("#chPPendiente").prop("checked");
        var estadopago = $("#chPPago").prop("checked");
        
        var querywhere = "1=1";
        if (estadopago == true && estadopendiente == true) {

        }
        else {
            if (estadopago == true) 
                querywhere = querywhere + " and estado=1";
            if (estadopendiente == true)
                querywhere = querywhere + " and estado=0";
        }

        if (valDesde != "")
            querywhere = querywhere + " and fecha >= '" + valDesde + "'";

        if (valHasta != "")
            querywhere = querywhere + " and fecha <= '" + valHasta + "'";

        var queryTask = new esri.tasks.QueryTask(URL_Map_ServerProductor + "/0");

        if (_esProductor)
            querywhere = querywhere + " and idprod=" + _idUser;

        var query = new esri.tasks.Query();
        query.orderByFields = ["establecimiento", "estado"];
        query.where = querywhere;
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.outSpatialReference = _map.spatialReference;
        queryTask.execute(query, ObtenerResultadosQuery, ErrorObtenerResultados);

    } catch (e) {

    }
}

function ObtenerResultadosQuery(featureSet)
{
    try {
             var establecimientosbody = $("#BodyModalEstablecimiento");
             establecimientosbody.empty();
             var row = ""
             for (var i = 0; i < featureSet.features.length; i++) {
                      
                 row = row + '<div class="danger divEstablecimientosTableRow">'
                                   + '<div class="divEstablecimientosTableCell"><button onclick="ZoomEstablecimiento(' + featureSet.features[i].attributes["OBJECTID"] + ');" class="zoomEstablecimiento" title="Acercar"></button></div>'
                                   + '<div class="divEstablecimientosTableCell">' + featureSet.features[i].attributes["establecimiento"] + '</div>';

                 if (featureSet.features[i].attributes["estado"] == 1)
                     row = row + '<div class="divEstablecimientosTableCell">Pago</div>';
                 else
                     row = row + '<div class="divEstablecimientosTableCell">Pendiente</div></div>';
                 row = row + '</div>';  
                 

             }
             establecimientosbody.append(row);
             $("#modalEstablecimientos").modal("show");
             $("#modalFiltrarMapa").modal("hide");
             

    } catch (e) {

    }

}

function ErrorObtenerResultados()
{
    try {
        //alert(2);
    } catch (e) {

    }

}

function ZoomEstablecimiento(objectid) {
    var queryTask = new esri.tasks.QueryTask(URL_Map_ServerProductor + "/0");

    var query = new esri.tasks.Query();
    query.where = "OBJECTID = " + objectid;
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.outSpatialReference = _map.spatialReference;
    queryTask.executeForExtent(query, ZoomPol);
}

function resetFilters() {
    
    if (Object.keys(_filters).length == 0) {//nuca ha filtrado
        inicializarFiltros();
    }
    else {//ya ha filtrado

        $.each(Object.keys(_filters), function (index, filter) {
            $($($("#mapFilters div[data-capa=" + filter + "]")).find(".filtersLayer")).html(crearFiltrosCapa(filter, _filters[filter]));
        });
    }

}

function filtrarMapa() {

    $.each($("#mapFilters .filtersLayer"), function (index, div) {

        var capa = $($(div).parent()).data("capa");

        filtrarCapaDesdeHTML(capa, $(div));

    });
}

function filtrarCapaDesdeHTML(capa, div) {

    var layer = _dicMapServerLayers[capa];
    var inputs = div.find("input")

    var chEstado1=null;
    var chEstado2=null;

    if (capa == "PRODUCTOR") {

        var valDesde = $(inputs[0]).val();
        var valHasta = $(inputs[1]).val();
        var fechaFiltro = "";

        if (valDesde != "" && valHasta != "")
            fechaFiltro = " '" + valDesde + "' <= " + " fecha and fecha <= '" + valHasta + "' "

        //chPendiente
        chEstado1 = $(inputs[2]).prop("checked")
        //chPago
        chEstado2 = $(inputs[3]).prop("checked")

        var estadoFiltro = "";

        estadoFiltro = chEstado1 ? " estado = " + _estados['pendiente'] : "";
        estadoFiltro += chEstado2 ? (estadoFiltro == "" ? " estado = " + _estados['pago'] : " or estado=" + _estados['pago']) : "";


        var definitionExpression = "idprod=" + _idUser
                                 + (fechaFiltro == "" ? "" : " and (" + fechaFiltro + ")")
                                 + (estadoFiltro == "" ? "" : " and (" + estadoFiltro + ")");
        
    }
    else if (capa == "AMBIENTE") {

        var valDesde = $(inputs[0]).val();
        var valHasta = $(inputs[1]).val();
        var fechaFiltro = "";

        if (valDesde != "" && valHasta != "")
            fechaFiltro = " '" + valDesde + "' <= " + " fechamod and fechamod <= '" + valHasta + "' "

        var estadoFiltro = "";
        var definitionExpression="";

        if (_esProductor) {
            definitionExpression="idprod="
            estadoFiltro = " estado = " + _estados['notificado']
        }
        else {
            definitionExpression = "idtecnico="
            //chPago
            chEstado1 = $(inputs[2]).prop("checked")

            //chNotificado
            chEstado2 = $(inputs[3]).prop("checked")

            estadoFiltro = chEstado1 ? " estado = " + _estados['pago'] : "";
            estadoFiltro += chEstado2 ? (estadoFiltro == "" ? " estado = " + _estados['notificado'] : " or estado=" + _estados['notificado']) : "";
        }

        definitionExpression += _idUser
                     + (fechaFiltro == "" ? "" : " and (" + fechaFiltro + ")")
                     + (estadoFiltro == "" ? "" : " and (" + estadoFiltro + ")");

    } 
    else if (capa == "PRESCRIPCION") {

        var valDesde = $(inputs[0]).val();
        var valHasta = $(inputs[1]).val();
        var fechaFiltro = "";

        if (valDesde != "" && valHasta != "")
            fechaFiltro = " '" + valDesde + "' <= " + " fechamod and fechamod <= '" + valHasta + "' "

        var estadoFiltro = "";
        var definitionExpression = "";

        if (_esProductor) {
            definitionExpression = "idprod="
            estadoFiltro = " estado = " + _estados['calculado']
        }
        else {
            definitionExpression = "idtecnico="
            //chNoCalculado
            chEstado1 = $(inputs[2]).prop("checked")

            //chCalculado
            chEstado2 = $(inputs[3]).prop("checked")

            estadoFiltro = chEstado1 ? " estado = " + _estados['nocalculado'] : "";
            estadoFiltro += chEstado2 ? (estadoFiltro == "" ? " estado = " + _estados['calculado'] : " or estado=" + _estados['calculado']) : "";
        }

        definitionExpression += _idUser
                     + (fechaFiltro == "" ? "" : " and (" + fechaFiltro + ")")
                     + (estadoFiltro == "" ? "" : " and (" + estadoFiltro + ")");


    }

    var layerDefinitions = [];
    layerDefinitions[0] = definitionExpression

    filtrarCapa(layer, layerDefinitions);

    console.log(definitionExpression)

    _filters[capa] = [valDesde, valHasta, chEstado1, chEstado2]

}

function filtrarCapa(layer,filtro) {
    layer.setLayerDefinitions(filtro);//SETEO FILTRO
}

/*FILTROS*/




/*PAGO*/

var _featuresPendiente = {}
var _listapago = null;
function consultarPendientes() {
    //$('.loading').removeClass("ocultar");
    //var layer = _dicFeaturesLayers["PRODUCTOR"];

    //var query = new Query();
    //query.returnGeometry = true;
    //query.where = "idprod="+_idUser+" and estado=0"
    //query.outFields = ["OBJECTID", "establecimiento", "estado", "precio", "ADP.SDE.productor.area"];

    //_featuresPendiente = {};

    //layer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (features) {
                
    //        $('.loading').addClass("ocultar");

    //        if (features.length > 0) {
    //            var pagosTablaBody = $(".divPagosTableBody");
    //            pagosTablaBody.empty();
                
    //            $.each(features, function (index, feature) {
    //                var attr = feature.attributes;
    //                var oid = attr["OBJECTID"];
    //                _featuresPendiente[oid] = feature;
    //                pagosTablaBody.append(createPagosRow(oid, attr.establecimiento, attr["ADP.SDE.productor.area"], attr.precio));
    //            });

    //            $("#modalPagos").modal("show");
    //        }
    //        else {
    //              //no encontro poligonos para pagar
    //        }
    //});

    _listapago = null;
    $.ajax({
        url: "ObtenerPagosProductor",
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        type: "POST",
        data: JSON.stringify({ idusuario: _idUser }),
        error: function () {
            mostrarError("Error al intentar generar formulario de pago");
        },
        success: function (listapago) {
            _listapago = listapago;
            var pagosTablaBody = $(".divPagosTableBody");
            pagosTablaBody.empty();
            for (var i = 0; i < listapago.length; i++) {
                pagosTablaBody.append(createPagosRow(listapago[i].OIDArea, listapago[i].Establecimiento, listapago[i].Area, listapago[i].Precio));
            }
            $("#modalPagos").modal("show");

        }

    });
   

}

function createPagosRow(id,establecimiento,area,precio) {
    //var precio1 = Math.trunc(precio);
    //var area1 = Math.round(area * 100) / 100;
    var row =   '<div class="danger divPagosTableRow">'
                        //+'<div class="divPagosTableCell">'
                        //    + '<input type="button" name="button" class="btnZoomAreaAPagar" data-id=' + id + ' />'
                        //+'</div>'
                        + '<div class="divPagosTableCell"><button onclick="ZoomEstablecimiento(' + id + ');" class="zoomEstablecimiento" title="Acercar"></button></div>'
                        + '<div class="divPagosTableCell">' + establecimiento + '</div>'
                        +'<div class="divPagosTableCellMov">Pendiente</div>'
                        + '<div class="divPagosTableCellMov">' + area + '</div>'
                        +'<div class="divPagosTableCell">'+precio+'</div>'
                        +'<div class="text-center divPagosTableCell"><input class="chPagoConfirm" name="cb2" id="cb2" type="checkbox" data-id=' + id + '></div>'
                 +'</div>'

    return row

}


function enviarPrescripcion() {

    // ver que parametros pasar

    $('.loading').removeClass("ocultar");

    var vIdCapa = $("#txtIdCapaPresc").val()
    var vNombreCapa = $("#txtNombreCapaPresc").val()

    var vFert1 = $("#txtFert1").val()
    var vFert2 = $("#txtFert2").val()
    var vFert3 = $("#txtFert3").val()

    if (!vFert1 && !vFert2 && !vFert3)
    {
        mostrarError("Se debe ingresar al menos un nombre de fertilizante", 5);
        return;
    }

    var vAlto1 = $("#txtAlto1").val()
    var vAlto2 = $("#txtAlto2").val()
    var vAlto3 = $("#txtAlto3").val()
    var vAlto4 = $("#txtAlto4").val()

    var vMedio1 = $("#txtMedio1").val()
    var vMedio2 = $("#txtMedio2").val()
    var vMedio3 = $("#txtMedio3").val()
    var vMedio4 = $("#txtMedio4").val()

    var vBajo1 = $("#txtBajo1").val()
    var vBajo2 = $("#txtBajo2").val()
    var vBajo3 = $("#txtBajo3").val()
    var vBajo4 = $("#txtBajo4").val()

    var vTotal1 = parseFloat($("#txtTotal1").val())
    var vTotal2 = parseFloat($("#txtTotal2").val())
    var vTotal3 = parseFloat($("#txtTotal3").val())
    var vTotal4 = parseFloat($("#txtTotal4").val())

    var vProm1 = parseFloat($("#txtProm1").val())
    var vProm2 = parseFloat($("#txtProm2").val())
    var vProm3 = parseFloat($("#txtProm3").val())

    var Prescripcion = {
        IdProductor: _idUser,
        IdCapa: vIdCapa,
        NombreCapa: vNombreCapa,
        Fert1: vFert1,
        Fert2: vFert2,
        Fert3: vFert3,
        Alto1: vAlto1,
        Alto2: vAlto2,
        Alto3: vAlto3,
        Alto4: vAlto4,
        Medio1: vMedio1,
        Medio2: vMedio2,
        Medio3: vMedio3,
        Medio4: vMedio4,
        Bajo1: vBajo1,
        Bajo2: vBajo2,
        Bajo3: vBajo3,
        Bajo4: vBajo4,
        Total1: vTotal1,
        Total2: vTotal2,
        Total3: vTotal3,
        Total4: vTotal4,
        Prom1: vProm1,
        Prom2: vProm2,
        Prom3: vProm3
    };
    // pasar array con parametros data.push(crearPago(feature.attributes));
 

    $.ajax({
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        type: 'POST',
        url: "InformarPrescripcion",
        data: JSON.stringify(Prescripcion) ,
        success: function (response) {
            //Informar exito de email
            if (response.Exito) {
                mostrarSuccess("Se ha enviado el email con los datos de la prescripción correctamente", 5)
            }
            else {
                mostrarError(response.Error, 5);
            }
            _map.infoWindow.hide();
        },
        error: function (result) {
            _map.infoWindow.hide();
        }
    });
}


function notificarResultado() {
       
    var tipoCapa;

    var radioValue = $("input[name='optradio']:checked").val();
    if (radioValue == "Ambiente") {
        tipoCapa = "ambiente";
    }
    else
    {
        tipoCapa = "prescripcion";
    }

    var vNumOrden = $("#txtNumeroOrden").val();

    $('.loading').removeClass("ocultar");

    $.ajax({
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        type: 'POST',
        url: "NotificarResultados",
        data: JSON.stringify({ "pNumeroOrden": vNumOrden, "pTipoCapa": tipoCapa }),//"{message:'hola'}",
        success: function (response) {
            if (response.Exito)
            {
                mostrarSuccess("Se ha notificado correctamente la tarea realizada", 4)
            }            
            else {
                mostrarError(response.Error, 4)
            }
        },
        error: function (result) {
            mostrarError("Se produjo un problema al intentar notificar al productor", 4)
        }
    });
    consultarElementosPendientes();
}


function crearPago(attributes) {


    return { "IdProductor": _idUser, "OIDArea": attributes["OBJECTID"], "Establecimiento": attributes.establecimiento, "Área": attributes["ADP.SDE.productor.area"], "Precio": attributes.precio }
}

function realizarPago() {

    var pagos = new Array();

    var pagosChecked = $(".divPagosTableBody .divPagosTableRow .divPagosTableCell .chPagoConfirm:checked");

    if (pagosChecked.length > 0) {

        var data=new Array;

        $.each(pagosChecked, function (index, ch) {

            var oid = $(ch).data("id")
            
            for (var i = 0; i < _listapago.length; i++) {
                if (_listapago[i].OIDArea == oid)
                {
                    data.push(_listapago[i]);
                }
            }

           // var feature = _featuresPendiente[oid];
           // data.push(crearPago(feature.attributes));

        });
        //console.log(JSON.stringify(data))
        
        $('.loading').removeClass("ocultar");
       ObtenerFormPago(JSON.stringify(data));

        //$.ajax({
        //    dataType: 'json',
        //    contentType: 'application/json; charset=UTF-8',
        //    type: 'POST',
        //    url: "RealizarPago",
        //    data: JSON.stringify(data),//"{message:'hola'}",
        //    success: function (response) {
        //        mostrarSuccess("El pago fue realizado con éxito", 3)
        //        //ObtenerFormPago();
                
        //    },
        //    error: function (result) {
        //        mostrarError("Se produjo un problema al intentar realizar el pago",3)
        //    }
        //});
    }
    consultarElementosPendientes();
}

/*PAGO*/



/*CARGA DE SHAPEFILE*/
//shapefiles http://www.naturalearthdata.com/features/

function cargarShapeFile(fileName) {

    if (sniff("ie")) { //filename is full path in IE so extract the file name
        var arr = fileName.split("\\");
        fileName = arr[arr.length - 1];
    }
    if (fileName.indexOf(".zip") !== -1) {//is file a zip - if not notify user
        generateFeatureCollection(fileName);
    }
    else {
        mostrarError("Agregue un archivo shapefile como .zip", 0);
    }

    $("#btnCargarShapefile").val("");
}
function generateFeatureCollection(fileName) {

    $('.loading').removeClass("ocultar");

    var name = fileName.split(".");
    //Chrome and IE add c:\fakepath to the value - we need to remove it
    //See this link for more info: http://davidwalsh.name/fakepath
    name = name[0].replace("c:\\fakepath\\", "");

    //dom.byId('upload-status').innerHTML = '<b>Loading… </b>' + name;

    //Define the input params for generate see the rest doc for details
    //http://www.arcgis.com/apidocs/rest/index.html?generate.html


    var params = {
        'name': name,
        'targetSR': _map.spatialReference,
        'maxRecordCount': 1000,
        'enforceInputFileSizeLimit': true,
        'enforceOutputJsonSizeLimit': true
    };

    //generalize features for display Here we generalize at 1:40,000 which is approx 10 meters
    //This should work well when using web mercator.
    var extent = scaleUtils.getExtentForScale(_map, 40000);
    var resolution = extent.getWidth() / _map.width;
    params.generalize = true;
    params.maxAllowableOffset = resolution;
    params.reducePrecision = true;
    params.numberOfDigitsAfterDecimal = 0;

    var myContent = {
        'filetype': 'shapefile',
        'publishParameters': JSON.stringify(params),
        'f': 'json',
        'callback.html': 'textarea'
    };

    esriConfig.defaults.io.proxyUrl = "/proxy/";
    var portalUrl = "https://www.arcgis.com";
    //use the rest generate operation to generate a feature collection from the zipped shapefile
    request({
        url: portalUrl + '/sharing/rest/content/features/generate',
        content: myContent,
        form: dom.byId('uploadFormSHP'),
        handleAs: 'json',
        load: lang.hitch(this, function (response) {
            if (response.error) {
                errorHandler(response.error);
                return;
            }
            var layerName = response.featureCollection.layers[0].layerDefinition.name;
            addShapefileToMap(response.featureCollection);
        }),
        error: lang.hitch(this, errorHandler)
    });


}
function errorHandler(error) {

    mostrarError("Se ha producido un error inesperado", 0);// error.message 

}
function addShapefileToMap(featureCollection) {
    //add the shapefile to the map and zoom to the feature collection extent
    //If you want to persist the feature collection when you reload browser you could store the collection in
    //local storage by serializing the layer using featureLayer.toJson()  see the 'Feature Collection in Local Storage' sample
    //for an example of how to work with local storage.
    var fullExtent;
    var layers = [];

    arrayUtils.forEach(featureCollection.layers, function (layer) {
        //change default symbol if desired. Comment this out and the layer will draw with the default symbology
        var featureLayer = new FeatureLayer(layer);
        //var infoTemplate = new InfoTemplate("Details", "${*}");
        //featureLayer.setInfoTemplate(infoTemplate);     
        //fullExtent = fullExtent ?
        //fullExtent.union(featureLayer.fullExtent) : featureLayer.fullExtent;
        layers.push(featureLayer);
    });

    if (layers.length == 1) {

        if (_shapeFileLayer)
            _map.removeLayer(_shapeFileLayer);

        _shapeFileLayer = layers[0];

        if (_shapeFileLayer.geometryType == "esriGeometryPolygon") {

            //evento click
            _shapeFileLayer.on('click', function (event) {
                var position = event.graphic.getLayer().graphics.indexOf(event.graphic);//eso no es muy eficiente pero tampoco calienta mucho
                if (position != -1)
                    setCurrent(position);
            });
            //changeRenderer(_shapeFileLayer);
            _map.addLayer(_shapeFileLayer);
            crearVentanaEdicionDinamicamente();
            $("#barraEdicion").removeClass("ocultar");
            $(".herramientaDibujo").addClass("ocultar");
            setCurrent(0);
        }
        else {
            //no es de tipo poligono
            mostrarError("El shapefile cargado, tiene otro tipo de geometrías que no son polígonos", 0);
        }
    }
    else {
        mostrarError("El SHP cargado tiene mas de una capa", 0);
    }
    $('.loading').addClass("ocultar");
}
function changeRenderer(layer) {
    //change the default symbol for the feature collection for polygons and points
    var symbol = null;
    switch (layer.geometryType) {
        case 'esriGeometryPolygon': {
            symbol = _polygonSymbol;

            //_colorCyan = new Color([71, 242, 255]);
            //_colorCyanTransparentado = new Color([71, 242, 255, 0.25]);
            //new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            //                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([71, 242, 255, 0.25]), 2)
            //                , new Color([71, 242, 255]))

            break;
        }
    }
    if (symbol) {
        layer.setRenderer(new SimpleRenderer(symbol));
    }

    return symbol;
}

/*CARGA DE SHAPEFILE*/


/*CARGA KML*/

function cargarKML(fileName) {

    $('.loading').removeClass("ocultar");
    request({
        url: 'KmlFileProcess',
        form: dom.byId('uploadFormKML'),
        handleAs: 'json',
        load: lang.hitch(this, function (response) {
            cargarKMLFinished(response);
        }),
        error: lang.hitch(this, function () { $('.loading').addClass("ocultar"); mostrarError("Se ha producido un error inesperado", 0); })
    });


    $("#btnCargarKML").val("");

}

function cargarKMLFinished(response) {

    var kmlURL = response.DownloadUrl;
    var id = response.FileName;
    //kmlURL = "http://vigilia.ica.com.uy/ADP/KMLTemporales/Feller_MG.kml"
    //kmlURL = "http://vigilia.ica.com.uy/ADP/KMLTemporales/prescripcion_1252_elpicaflor.kmz"
    //kmlURL = "http://vigilia.ica.com.uy/ADP/KMLTemporales/mapazonas_elpicaflor.kmz"
    //kmlURL = "http://vigilia.ica.com.uy/ADP/KMLTemporales/UruguayROUuzqopdmleh14c3nizcrywpnk.kml"
    //kmlURL = "https://dl.dropboxusercontent.com/u/2142726/esrijs-samples/Wyoming.kml";

    if (_kmlLayer)
        _map.removeLayer(_kmlLayer);


    _kmlLayer = new KMLLayer(kmlURL, {
        outSR: _map.spatialReference,
        hasAttributionData: false
    });

    _kmlLayer.id = id;
    _map.addLayer(_kmlLayer);

    _kmlLayer.on("load", function () {

        //alert(response.FilePath)
        $.ajax({
            url: "DeleteKMLFile",
            data: { filePath: response.FilePath },
            dataType: "json",
            type: "POST",
            error: function () {
                //alert("Ocurrió un error al intentar eliminar los archivos temporales");
            },
            success: function (data) {
                //if (data.Error != null && data.Error != undefined && data.Error != "")
                //alert(data.Error);
            }
        });



        var error = kmlLayerLoaded();
        if (!error) {
            crearVentanaEdicionDinamicamente();
            $("#barraEdicion").removeClass("ocultar");
            $(".herramientaDibujo").addClass("ocultar");
            selectFeature();
        }
        else {
            restartCargaArchivo();
            mostrarError("El KML cargado, tiene otro tipo de geometrías que no son polígonos", 0);
        }

    });
   
    $('.loading').addClass("ocultar");
}

function kmlLayerLoaded() {
    var error = false;
    dojo.forEach(_kmlLayer.getLayers(), function (lyr) {
        var i = 0;
        while (i < lyr.graphics.length && !error) {
            error = lyr.graphics[i].geometry.type != "polygon"
            generateMyAttributes(lyr.graphics[i]);
            
            i++
        }

        if (!error) {

            lyr.on('click', function (event) {//a todas las capas kml le seteo el evento onclick

                //PARA ENTENDER TODO ESTO, EL PORQUE, PUEDE VERSE EL selectFeature

                var klayers = _kmlLayer.getLayers();//todas las layers

                var layerkml = event.graphic.getLayer();//me quedo con la layer del grafico que seleccione
                var position = layerkml.graphics.indexOf(event.graphic);//me quedo con su posicion dentro del array de graphics de esa layer

                var layerIndexOf = klayers.indexOf(layerkml);//me fijo el indexof de la layer dentro de las layers

                var cantGraficos = 0;//el current va a ser, la suma de, los graficos de las capas anteriores + la posicion en la actual

                for (var i = 0; i < layerIndexOf; i++) {
                    cantGraficos += klayers[i].graphics.length;
                }

                var current = position + cantGraficos;

                if (current != -1)
                    setCurrent(current);

            });
        }
    });
    return error;
}

function generateMyAttributes(graphic) {

    graphic.myattributes = {};

    var tdNombresAttr = $(graphic.attributes.description).find("table tr td:first-child");
    var tdValoresAttr = $(graphic.attributes.description).find("table tr td:nth-child(2)");
    //LOS LARGOS DEBERIAN SER IGUALES

    for (var i = 0; i < tdNombresAttr.length; i++) {

        var key = ("" + $(tdNombresAttr[i]).html()).toLowerCase();
        var value = $(tdValoresAttr[i]).html()

        if (key == "leyenda") {
            graphic.myattributes[key] = value;
        }
        else if (key == "sup") {
            graphic.myattributes[key] = parseFloat(value);
        }
        else if (key == "comp") {
            graphic.myattributes[key] = parseInt(value)
        }

    }

}

/*CARGA KML*/

/*MANEJO DE KML Y SHP */



//esta funcion reinicializa todas las variables globales anteriores al momento de hacer una carga de shape o kml
function restartCargaArchivo() {

    handleMapCursor();

    _editToolbar.deactivate();
    _toolEditionActivada = false;

    if (_capa != "NINGUNA") {
        $("#editorFeatures").addClass("ocultar");//[data-capa='" + _capa + "']
        $("#currentFeatures" + _capa).html("?");
        $("#cantFeatures" + _capa).html("?");
    }

    $("#barraEdicion").addClass("ocultar");
    $(".herramientaDibujo").removeClass("ocultar");

    if (_esCargaShape == 0) {

        if (_shapeFileLayer) {
            _map.removeLayer(_shapeFileLayer);
            _shapeFileLayer = undefined
        }

    }
    else if (_esCargaShape == 1) {
        if (_kmlLayer) {
            _map.removeLayer(_kmlLayer);
            _kmlLayer = undefined
        }
    }
    else if (_esCargaShape == 2) {
        _editionLayer.clear();
        _drawToolBar.deactivate()
    }

    _esCargaShape = -1;
    _fileName = "";
    _capa = "NINGUNA";
    _current = -1;
    _selectedGraphic = undefined;
    _kmlCurrent = -1;
    _layerkml = undefined;


}

//muestra modal para elegir la carga de shp o kml, a que capa va a parar
function consultarTipoCapa(esCargaShape, fileName) {
    $("#modalTipoCapa").modal("show");
    restartCargaArchivo();
    _esCargaShape = esCargaShape;
    _fileName = fileName;
}
//luego de que se selecciono que capa, se procede a cargar realmente el shp o kml
function consultarTipoCapaSelected(capa, esCargaShape, fileName) {
    $("#modalTipoCapa").modal("hide");

    if(!isNaN(esCargaShape))
        _esCargaShape = esCargaShape;

    if(fileName)
        _fileName = fileName;

    _capa = capa;

    if (_esCargaShape == 0) {
        cargarShapeFile(_fileName);
    }
    else if (_esCargaShape == 1) {
        cargarKML(_fileName);
    }
    else if (_esCargaShape == 2) {
        var elem = $("#barraEdicion");

        if (elem.hasClass("ocultar"))
            elem.removeClass("ocultar")
        else
            elem.addClass("ocultar")

        drawFeature(_fileName)//en filename va el tipo Poligono o Circulo
    }

}

//desde cualquiera de las ventanas de edicion, hay flechitas para pasear entre los distintos graficos desplegados en el mapa
function handleCurrent(elem) {

    if (_esCargaShape == 2 && _current == -1)//significa que todavia no hay ninguno creado
        return;

    if (elem.data("type") == "forward")
        setCurrent(_current + 1);
    else
        setCurrent(_current - 1);

}

//setea el current, para eso, deselecciona el grafico anterior y selecciona el current
function setCurrent(current) {
    deselectFeature();

    $.each($("#editorFeatures").find("div.panel-body div input"), function (index, input) {
        $(input).val("");
    });

    _current = current;

    selectFeature();
}

function deselectFeature() {

    if (_current != -1 && _selectedGraphic) {//porque cuando se borra no existe el _selectedGraphic

        var layer;

        switch (_esCargaShape) {
            case 0: layer = _shapeFileLayer; break;
            case 1: layer = _layerkml; break;
            case 2: layer = _editionLayer; break;
        }

        //layer.remove(_selectedGraphic);
        //_selectedGraphic.symbol = _polygonSymbol;
        //layer.graphics.splice(_current, 0, _selectedGraphic);//_shapeFileLayer.add(graphic)* //este no, asi no lo coloca al final
    }
}

function selectFeature() {

    var layer;
    var cantGraphics;
    var realcurrent;
    var attributes={};

    if (_esCargaShape == 0) {

        //esto para que sea circular
        _current = _current == -1 ? _shapeFileLayer.graphics.length - 1 : _current;
        _current = _current % (_shapeFileLayer.graphics.length);

        layer = _shapeFileLayer;

        cantGraphics = layer.graphics.length;

        realcurrent = _current;
    }
    else if (_esCargaShape == 1) {

        cantGraphics = 0;//aca se guarda el total de graficos porque _kmlLayer puede tener varias layers

        dojo.forEach(_kmlLayer.getLayers(), function (lyr) {
            cantGraphics += lyr.graphics.length;
        });

        //el current es current al total de graficos en todas las capas
        _current = _current == -1 ? cantGraphics - 1 : _current;
        _current = _current % (cantGraphics);

        //hasta aca igual que el shape, nada mas que conte todos los graficos de todas las capas

        _kmlCurrent = -1;//xq pueden haber varias capas, por ende, el _kmlCurrent, va a ser la posicion del grafico en alguna de las capas
        var currentAux = _current;
        //lo podria recorrer con un while, ya que lo que quiero ubicar es el _kmlCurrent
        dojo.forEach(_kmlLayer.getLayers(), function (lyr) {
            if (currentAux < lyr.graphics.length && _kmlCurrent == -1) {//si el current es menor a la cantidad de graficos, y todavia no se seteo
                _layerkml = lyr;
                _kmlCurrent = currentAux;
            }
            else {
                currentAux -= lyr.graphics.length;
            }
        });

        layer = _layerkml;
        realcurrent = _kmlCurrent;
  
    }
    else if (_esCargaShape == 2) {

        _current = _current == -1 ? _editionLayer.graphics.length - 1 : _current;
        _current = _current % (_editionLayer.graphics.length);

        layer = _editionLayer;

        cantGraphics = layer.graphics.length;

        realcurrent = _current;
    }

    //seteo en la ventanita de edicion el current
    $("#currentFeatures" + _capa).html(_current + 1);
    $("#cantFeatures" + _capa).html(cantGraphics);

    //selecciono el grafico
    _selectedGraphic = layer.graphics[realcurrent];
    //lo remuevo
    //layer.remove(_selectedGraphic);
    //le pongo el symbol seleccionado
    //_selectedGraphic.symbol = _selectedPolygonSymbol
    //y lo vuelvo a insertar en la capa, en la misma posicion
    //layer.graphics.splice(realcurrent, 0, _selectedGraphic);//layer.add(graphic)* //este no, asi no lo coloca al final

    attributes = _esCargaShape == 1 ? _selectedGraphic.myattributes : _selectedGraphic.attributes;

    //muestro los atributos en la ventana
    $.each($("#editorFeatures").find("div.panel-body div input:not([type='checkbox'])"), function (index, input) {

        var autocalculate = $(input).data("autocalculate");

        if (attributes[($(input).data("field")).toLowerCase()]) {
            $(input).val(attributes[$(input).data("field")])
        }
        else if (autocalculate) {
            if (autocalculate == "area") {
                if (_selectedGraphic)
                    calcularArea(_selectedGraphic, $(input).data("field"), $(input));
            }
            //else if (autocalculate == "precio") {//SI ES PRECIO, NO IMPORTA, SE CALCULA A PARTIR DEL AREA, EL CALCULAR AREA LUEGO LO HACE
            //    $(input).val((_precioXHA*parseFloat(_selectedGraphic.attributes[$(input).data("auxiliar-field")])).toFixed(2))
            //}
        }
        else {
            $(input).val("")
        }

    });
    
    if (!_esProductor) {
        var existeComboProductor = $("#comboProductor");
        if (existeComboProductor) {//si esta el combo para llenar y en attributes no existe nombre productor es que nunca se seteo

            if (!attributes["nomprod"])
                $("#selectedProductor").html("---")
            else
                $("#selectedProductor").html(attributes["nomprod"])
        }
        var existeComboLeyenda = $("#comboLeyenda");
        if (existeComboLeyenda) {//si esta el combo para llenar y en attributes no existe nombre productor es que nunca se seteo

            if (!attributes["leyenda"])
                $("#selectedLeyenda").html("---")
            else
                $("#selectedLeyenda").html(attributes["leyenda"])
        }
        if (_esCargaShape == 2) {
          //  if (attributes["sup"] == null) si lo tiene que no lo calcule
            calcularAreaTecnico(_selectedGraphic); // esto es solo cuando dibuja

        }

    }


    //hago zoom al grafico
    zoomToGeometry(_selectedGraphic.geometry);
}

function changeFeatureAttr(field, value) {
    //alert(value)
    if (_esCargaShape == 0) {
        _shapeFileLayer.graphics[_current].attributes[field] = value;
    }
    else if (_esCargaShape == 1) {
        _layerkml.graphics[_kmlCurrent].myattributes[field] = value;//EN MY ATTRIBUTES
    }
    else if (_esCargaShape == 2) {
        _selectedGraphic.attributes[field] = value;//en los otros podria trabajar sobre el _selectedGraphic
    }
}

/*MANEJO DE KML Y SHP*/


/*EDICION DE FEATURE*/

function activateToolbar(graphic) {

    //require(["esri/toolbars/edit"], function (Edit) {
        var tool = 0;
        tool = tool | Edit.MOVE;
        tool = tool | Edit.EDIT_VERTICES;
        tool = tool | Edit.SCALE;
        tool = tool | Edit.ROTATE;
        var options = {
            allowAddVertices: true,
            allowDeleteVertices: true,
            uniformScaling: true
        };
        _editToolbar.activate(tool, graphic, options);
        _toolEditionActivada = true;
   // });
}

/*El _capa es en el array _dicFeaturesLayers*/
function crearVentanaEdicionDinamicamente() {

    var ventanaEdicionHeader = $("#editorFeatures .panel-heading");
    var ventanaEdicionBody = $("#editorFeatures .panel-body");

    var body = "";

    var nombreCapa=getLayerName(_capa);
       
    var traerProductores=false;

    switch (_capa) {

        case "AMBIENTE": {

            body =
                   //'<div id="comboProductores" class="input-group">' +

                   // '</div>' +
                    '<div class="input-group">' +
                        '<span class="input-group-addon">Superficie</span>' +
                        '<input data-field="sup" data-autocalculate="area" id="sup_tecnico" type="number" class="form-control editableFeatureField" name="start" />' +
                    '</div>' +
                    crearComboLeyenda();
                    //'<div class="input-group">' +
                    //    '<span class="input-group-addon">Leyenda</span>' +
                    //    '<input data-field="leyenda"  type="text" class="form-control editableFeatureField" name="start"/>' +
                    //'</div>';
            traerProductores = true;
            break;
        }
        case "PRESCRIPCION": {

            body =
                   // '<div id="comboProductores" class="input-group">' +

                   // '</div>' +
                   '<div class="input-group">' +
                       '<span class="input-group-addon">Superficie</span>' +
                       '<input data-field="sup" data-autocalculate="area" id="sup_tecnico" type="number" class="form-control editableFeatureField" name="start" />' +
                   '</div>' +
                    crearComboLeyenda()+
                   //'<div class="input-group">' +
                   //    '<span class="input-group-addon">Leyenda</span>' +
                   //    '<input data-field="leyenda"  type="text" class="form-control editableFeatureField" name="start"/>' +
                   //'</div>' +
                    '<div class="input-group">' +
                       '<span class="input-group-addon">Comp</span>' +
                       '<input data-field="comp"  type="text" class="form-control editableFeatureField" name="start" />' +
                   '</div>';
            traerProductores = true;
            break;
        }
        case "PRODUCTOR": {
                    body = '<div class="input-group">' +
                        '<span class="input-group-addon">Fecha</span>' +
                        '<input data-field="fecha" type="date" class="form-control editableFeatureField" name="start" />' +
                    '</div>' +
                    '<div class="input-group">' +
                        '<span class="input-group-addon">Establecimiento</span>' +
                        '<input data-field="establecimiento" type="text" class="form-control editableFeatureField" name="start" />' +
                    '</div>' +
                    '<div class="input-group">' +
                        '<span class="input-group-addon">Área (ha)</span>' +
                        '<input data-field="ADP.SDE.productor.area" data-autocalculate="area" data-auxiliar-input="dPPrecio" type="number" class="form-control editableFeatureField" name="start" disabled/>' +
                    '</div>' +
                    '<div id="dPPrecio" class="input-group">' +
                        '<span class="input-group-addon">Precio (US$)</span>' +
                        '<input data-field="precio" type="number" step="0.01" placeholder="0.00" data-autocalculate="precio"  class="form-control editableFeatureField" name="start" disabled/>' +
                    '</div>'
        }
    }
    
    ventanaEdicionHeader.html(' <a class="collapsable" role="button" data-toggle="collapse" href="#collapseEditor" aria-expanded="true" aria-controls="collapseEditor">' +
                                     '<img src="../Assets/img/menu/pencil.png"/><span>' + nombreCapa + '</span>' +
                                '</a>' +
                              ' <span class="myRight">' +
                                 '<span id="currentFeatures' + _capa + '">?</span>' +
                                 '<span> de </span>' +
                                 '<span id="cantFeatures' + _capa + '">?</span>' +
                                 '<img data-type="forward" class="myRight boton btnCurrentFeature" src="../Assets/img/menu/forward.png"/>' +
                                 '<img data-type="back" class="myRight boton btnCurrentFeature" src="../Assets/img/menu/back.png"/>' +
                               '</span>');

    ventanaEdicionBody.html(body);
    //if (traerProductores) {
      //  getProductores(crearComboProductores);

    //}
    $("#editorFeatures").removeClass("ocultar");

}

function crearComboLeyenda() {
    

               
    var combo = '<div id="comboLeyenda" class="input-group">' +
                    '<div id="selectLeyenda" class="input-group">' +
                        '<span class="input-group-addon">Leyenda</span>' +
                        '<div class="btn-group">' +
                            '<a class="btn btn-default dropdown-toggle btn-select2" data-toggle="dropdown" href="#"><span id="selectedLeyenda">---</span><span class="caret"></span></a>' +
                            '<ul class="dropdown-menu"> ' +
                                '<li><a data-leyenda=' + _leyenda["bajo"] + ' href="#">BAJO</a></li>' +
                                '<li><a data-leyenda=' + _leyenda["medio"] + ' href="#">MEDIO</a></li>' +
                                '<li><a data-leyenda=' + _leyenda["alto"] + ' href="#">ALTO</a></li>';


    combo += '</ul></div></div></div>';

    return combo;

}

function drawFeature(type) {
    crearVentanaEdicionDinamicamente();
    $("#barraEdicion").removeClass("ocultar");
    $(".herramientaDibujo").removeClass("ocultar");

    if (type == "Poligono")
        _drawToolBar.activate("polygon");//
    else
        _drawToolBar.activate("circle");//

    handleMapCursor();
}

var drawEnd = function (evt) {

    var geometry = evt.geometry;
    // DE SER NECESARIO CONVIERTO A WGS84

    if (geometry.spatialReference.isWebMercator())
        projectToWebMercator(geometry);

    var graphic = new Graphic(geometry, _selectedPolygonSymbol);
    graphic.attributes = {}
    _editionLayer.add(graphic);

    $("#collapseEditor").collapse("show")
    
    setCurrent(_editionLayer.graphics.length - 1);

}

function eliminarFeatureEnEdicion() {

    if (_editToolbar._graphic && _selectedGraphic == _editToolbar._graphic) {
        _editToolbar.deactivate();
        _toolEditionActivada = false;
    }

    if (_selectedGraphic) {

        var layer;
        switch (_esCargaShape) {
            case 0: layer = _shapeFileLayer; break;
            case 1: layer = _layerkml; break;
            case 2: layer = _editionLayer; break;
        }

        layer.remove(_selectedGraphic);
        _selectedGraphic = undefined
        if (layer.graphics.length > 0)
            setCurrent(0);
        else
            restartCargaArchivo();
    }
}


function subirFeatures() {

    if (_capa != "NINGUNA" && _selectedGraphic) {
        $('.loading').removeClass("ocultar");

        var graphic = _selectedGraphic;

        if (_esCargaShape == 1) {//si es kml o kmz, le mando los atributos que yo arme
            graphic = new Graphic();
            graphic.geometry = _selectedGraphic.geometry
            graphic.attributes = _selectedGraphic.myattributes;
        }

        handleAttributes(_esProductor, graphic.attributes);

        //projectToWebMercator(graphic.geometry);


        
        //Esto es por el area q ahora se toma de GIS descomentar siguiente linea para dejar como antes
        graphic.attributes["ADP.SDE.productor.area"] = null


        _dicFeaturesLayers[_capa].applyEdits([graphic], null, null, function (evt) { subidaFeaturesCompleteado(true, true, _capa) }, function (evt) { subidaFeaturesCompleteado(true, false, _capa) });
       


    }

}


function realizarSubida() {
    //funcion que sube poligonos a la capa de ambiente o prescripcion
        
    var vNumOrd = $("#txtNumeroOrdenSubir").val();

    $.ajax({
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        type: 'POST',
        url: "ValidarSubida",
        data: JSON.stringify({ "pNumeroOrden": vNumOrd }),//"{message:'hola'}",
        success: function (response) {
            if (response.Exito) {
                subirTodosFeatures()
                consultarElementosPendientes();
            }
            else {
                mostrarError(response.Error, 4)
            }           

        },
        error: function (result) {
            mostrarError("Se produjo un problema al intentar subir los polígonos", 4)
        }
    });

   
}

function subirTodosFeatures() {   

        var vNumOrd = $("#txtNumeroOrdenSubir").val();

    $.ajax({
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        type: 'POST',
        data: JSON.stringify({ "pNumeroOrden": vNumOrd }),
        url: "GetDatosPorNumOrd",
        success: function (response) {

            if (_capa != "NINGUNA") {

                var layer;

                switch (_esCargaShape) {
                    case 0: layer = _shapeFileLayer; break;
                    case 1: layer = _layerkml; break;
                    case 2: layer = _editionLayer; break;
                }

                if (layer.graphics.length > 0) {
                    $('.loading').removeClass("ocultar");

                    var graphicsSubir = new Array();

                    $.each(layer.graphics, function (index, graphic) {
                                            //CALCULAR AREA DE SUPERFICIE
                        if (_esCargaShape == 1) {//si es kml o kmz, le mando los atributos que yo arme
                            var auxGraphic = graphic;
                            graphic = new Graphic();
                            graphic.geometry = auxGraphic.geometry
                            auxGraphic.myattributes["nomprod"] = response.NombreProductor;
                            auxGraphic.myattributes["celprod"] = response.Celular;
                            auxGraphic.myattributes["idprod"] = response.IdProductor;
                            auxGraphic.myattributes["numero_orden"] = vNumOrd;
                            graphic.attributes = auxGraphic.myattributes;
                        }
                        else {
                           // var auxGraphic = graphic;
                           // graphic = new Graphic();
                            //graphic.geometry = auxGraphic.geometry;
                            //graphic.myattributes = {};
                            //graphic.myattributes["nomprod"] = response.NombreProductor;
                            //graphic.myattributes["celprod"] = response.Telefono;
                            //graphic.myattributes["idprod"] = response.IdProductor;
                            //graphic.myattributes["numero_orden"] = vNumOrd;
                            //graphic.myattributes["sup"] = $("#sup_tecnico").val();  //CALCULAR SUPERFICIE QUITAR ESTE HARDCODED
                            //graphic.myattributes["leyenda"] = $("#selectedLeyenda").text();

                           // graphic.attributes = graphic.myattributes;
                            graphic.attributes["nomprod"] = response.NombreProductor;
                            graphic.attributes["celprod"] = response.Celular;
                            graphic.attributes["idprod"] = response.IdProductor;
                            graphic.attributes["numero_orden"] = vNumOrd;
                           // graphic.attributes["sup"] = $("#sup_tecnico").val();  //CALCULAR SUPERFICIE QUITAR ESTE HARDCODED
                            graphic.attributes["leyenda"] = $("#selectedLeyenda").text();

                        }

                        handleAttributes(_esProductor, graphic.attributes);

                        graphic.attributes["sup"] = null
                        graphicsSubir.push(graphic);
                    });

                    _dicFeaturesLayers[_capa].applyEdits(graphicsSubir, null, null, function (evt) { subidaFeaturesCompleteado(false, true, _capa) }, function (evt) { subidaFeaturesCompleteado(false, false, _capa) });
                }
            }
            
            //callback(response)
            //alert(JSON.stringify(response))
        },
        error: function (result) {
            mostrarError("Se produjo un problema al intentar subir los polígonos", 4)
        }
    });

   
   
}


function subirTodosFeaturesProductor() {

    if (_capa != "NINGUNA") {

        var layer;

        switch (_esCargaShape) {
            case 0: layer = _shapeFileLayer; break;
            case 1: layer = _layerkml; break;
            case 2: layer = _editionLayer; break;
        }

        if (layer.graphics.length > 0) {
            $('.loading').removeClass("ocultar");

            var graphicsSubir = new Array();

            $.each(layer.graphics, function (index, graphic) {

                if (_esCargaShape == 1) {//si es kml o kmz, le mando los atributos que yo arme
                    var auxGraphic = graphic;
                    graphic = new Graphic();
                    graphic.geometry = auxGraphic.geometry
                    graphic.attributes = auxGraphic.myattributes;
                }

                handleAttributes(_esProductor, graphic.attributes);
                
                graphicsSubir.push(graphic);

            });

            _dicFeaturesLayers[_capa].applyEdits(graphicsSubir, null, null, function (evt) { subidaFeaturesCompleteado(false, true, _capa) }, function (evt) { subidaFeaturesCompleteado(false, false, _capa) });
        }
    } 
}
function handleAttributes(esProductor,attributes) {
    if (esProductor) {
        attributes["idprod"] = _idUser;
        attributes["estado"] = _estados["pendiente"];//IGUAL EN LA BASE SI NO VA NADA, POR DEFECTO PONE 0 QUE ES PENDIENTE
    }
    else {
        attributes["idtecnico"] = _idUser;
        attributes["nomtecnico"] = _userName;        
        leyendaToCodigo(attributes);
        attributes["fechamod"] = formatDate(new Date());//SI ES TECNICO, CUALQUIERA DE LAS DOS CAPAS, TIENE UN FECHA MOD DEL ESTADO
        if (_capa == "AMBIENTE")
            attributes["estado"] = _estados["pago"];//ESTADO PAGO
        else
            attributes["estado"] = _estados["nocalculado"];//ESTADO NO CALCULADO
    }
}

function leyendaToCodigo(attributes) {
    
    if (attributes["leyenda"]) {
        var value = attributes["leyenda"].toLowerCase();
        switch (value) {
            case "bajo": { value = 0; break };
            case "medio": { value = 1; break };
            case "alto": { value = 2; break };
            default: { value = 0; break };
        }
        attributes["leyenda"] = value;
    }

}
function asignarLeyenda(leyenda) {
    if (_selectedGraphic) {

        var attributes = _esCargaShape == 1 ? _selectedGraphic.myattributes : _selectedGraphic.attributes;

        attributes["leyenda"] = leyenda;


        $("#selectedLeyenda").html(leyenda)
    }

}

function subidaFeaturesCompleteado(unfeature, correctamente,capa) {

   
    if (correctamente) {

        //_map.setExtent(_dicFeaturesLayers[_capa].fullExtent)


        //if (unfeature) {
        //    eliminarFeatureEnEdicion();
        //    mostrarSuccess("La geometría ha sido subida correctamente", 1)
        //}
        //else {
        //    restartCargaArchivo();
        //    mostrarSuccess("Las geometrías han sido subidas correctamente", 1)
        //}

        if (capa != "PRODUCTOR") {
          $.ajax({
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                type: "POST",
                url: "ActualizarArea",
                data: JSON.stringify({ capa1: capa, idusuario: _userName }),
                error: function () {
                    $('.loading').addClass("ocultar");
                    mostrarError("Se produjo un error al intentar subir a la capa, borre el poligono y vuelva a intentar", 1)
                },
                success: function (resultado) {
                    $('.loading').addClass("ocultar");
                    if (resultado != -1) {
                        if (unfeature) {
                            eliminarFeatureEnEdicion();
                            mostrarSuccess("La geometría ha sido subida correctamente", 1)
                        }
                        else {
                            restartCargaArchivo();
                            mostrarSuccess("Las geometrías han sido subidas correctamente", 1)
                        }
                        _dicMapServerLayers[capa].refresh();
                        consultarElementosPendientes();
                    }
                    else if (resultado == -1)
                    {
                        _dicMapServerLayers[capa].refresh();
                        mostrarError("Se produjo un error al intentar subir a la capa", 1)
                    }
                    else if (resultado == -2) {

                        mostrarError("Se produjo un error al intentar subir a la capa, borre el poligono y vuelva a intentar", 1)
                    }


                }

            });
        }
        else {
            $.ajax({
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                type: "POST",
                url: "ActualizarArea",
                data: JSON.stringify({ capa1: capa, idusuario: _idUser }),
                error: function () {
                    $('.loading').addClass("ocultar");
                    mostrarError("Se produjo un error al intentar subir a la capa", 1)
                },
                success: function (resultado) {
                    $('.loading').addClass("ocultar");
                    if (resultado != -1) {
                        if (unfeature) {
                            eliminarFeatureEnEdicion();
                            mostrarSuccess("La geometría ha sido subida correctamente", 1)
                        }
                        else {
                            restartCargaArchivo();
                            mostrarSuccess("Las geometrías han sido subidas correctamente", 1)
                        }
                        _dicMapServerLayers[capa].refresh();
                        consultarElementosPendientes();
                    }

                }

            });

        }

       
       


    }
    else {
        $('.loading').addClass("ocultar");
        mostrarError("Se produjo un error al intentar subir a la capa", 1)
    }

  //  _dicMapServerLayers[capa].refresh();

    //consultarElementosPendientes();
}


function prescripcionFeature(capa, objectid, numero_orden) {


    $.ajax({
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        type: 'POST',
        url: "GetHSPorNumOrd",
        data: JSON.stringify({ "pNumeroOrden": numero_orden }),//"{message:'hola'}",
        success: function (response) {
            if (response.Exito) {
                mostrarModalPrescripcion(capa, numero_orden, response.HSAlto, response.HSMedio, response.HSBajo, response.HSTotal)
            }
            else {
                mostrarError(response.Error, 4)
            }

        },
        error: function (result) {
            mostrarError("Se produjo un problema al intentar obtener datos del ambiente", 4)
        }
    });
}

function mostrarModalPrescripcion(capa, numero_orden, HSAlto, HSMedio, HSBajo, HSTotal)
{     

        $("#txtIdCapaPresc").val(numero_orden);
        $("#txtNombreCapaPresc").val(capa);

        //$("#txtFert1").val(0);
        //$("#txtFert2").val(0);
        //$("#txtFert3").val(0);

        $("#txtAlto1").val(0);
        $("#txtAlto2").val(0);
        $("#txtAlto3").val(0);
        $("#txtAlto4").val(HSAlto.toFixed(2));

        $("#txtMedio1").val(0);
        $("#txtMedio2").val(0);
        $("#txtMedio3").val(0);
        $("#txtMedio4").val(HSMedio.toFixed(2));

        $("#txtBajo1").val(0);
        $("#txtBajo2").val(0);
        $("#txtBajo3").val(0);
        $("#txtBajo4").val(HSBajo.toFixed(2));

        $("#txtTotal1").val(0);
        $("#txtTotal2").val(0);
        $("#txtTotal3").val(0);
            //$("#txtTotal4").val(0)

        $("#txtProm1").val(0);
        $("#txtProm2").val(0);
        $("#txtProm3").val(0);
   

        //Tengo que ir a la BD y pedir los datos de calculo de area agrupados por oid
        //total_hs = phsbajo + phsmedio + phsalto;
        $("#txtTotal4").val(HSTotal);

        //$("#txtTotal4").val(0)

        $(".calcularPre").change(function () {
            calcularCamposPrescripcion();
        });
        $("#modalPrescripcion").modal("show");
  
}


function calcularCamposPrescripcion() {

    //Los número (4) son Hs hectareas

    var vBajo1 = 0;
    var vBajo2 = 0;
    var vBajo3 = 0;
    //var vBajo4 = 0;

    var vMedio1 = 0;
    var vMedio2 = 0;
    var vMedio3 = 0;
    //var vMedio4 = 0;

    var vAlto1 = 0;
    var vAlto2 = 0;
    var vAlto3 = 0;
    //var vAlto4 = 0;

    vBajo1 = $("#txtBajo1").val();
    vBajo2 = $("#txtBajo2").val();
    vBajo3 = $("#txtBajo3").val();
    var vBajo4 = $("#txtBajo4").val();

    vMedio1 = $("#txtMedio1").val();
    vMedio2 = $("#txtMedio2").val();
    vMedio3 = $("#txtMedio3").val();
    var vMedio4 = $("#txtMedio4").val();

    vAlto1 = $("#txtAlto1").val();
    vAlto2 = $("#txtAlto2").val();
    vAlto3 = $("#txtAlto3").val();
    var vAlto4 = $("#txtAlto4").val();  

    //Total HS hectareas
    var vTotalHs = parseInt($("#txtTotal4").val());


    var vTotal1 = (parseInt(vBajo1) * parseInt(vBajo4)) + (parseInt(vMedio1) * parseInt(vMedio4)) + (parseInt(vAlto1) * parseInt(vAlto4));
    var vTotal2 = (parseInt(vBajo2) * parseInt(vBajo4)) + (parseInt(vMedio2) * parseInt(vMedio4)) + (parseInt(vAlto2) * parseInt(vAlto4));
    var vTotal3 = (parseInt(vBajo3) * parseInt(vBajo4)) + (parseInt(vMedio3) * parseInt(vMedio4)) + (parseInt(vAlto3) * parseInt(vAlto4));

    var vPromedio1 = (vTotal1 / vTotalHs) || 0;
    var vPromedio2 = (vTotal2 / vTotalHs) || 0;
    var vPromedio3 = (vTotal3 / vTotalHs) || 0;

    $("#txtTotal1").val(vTotal1.toFixed(2));
    $("#txtProm1").val(vPromedio1.toFixed(2));

    $("#txtTotal2").val(vTotal2.toFixed(2));
    $("#txtProm2").val(vPromedio2.toFixed(2));

    $("#txtTotal3").val(vTotal3.toFixed(2));
    $("#txtProm3").val(vPromedio3.toFixed(2));

    
}


var _capaFeatureAEliminar = -1;
var _oidFeatureAEliminar = -1;

function eliminarFeature(capa,objectid) {
    $('.loading').removeClass("ocultar");
    var graphic = new Graphic();
    graphic.attributes = { "OBJECTID": objectid };
    _dicFeaturesLayers[capa].applyEdits(null, null, [graphic], function (evt) { eliminarFeatureCompletado(true, capa) }, function (evt) { eliminarFeatureCompletado(false, capa) });
}

    function eliminarFeatureCompletado(correctamente,capa) {
        $('.loading').addClass("ocultar");
        if (correctamente) {
            consultarElementosPendientes();
            mostrarSuccess("Se ha eliminado correctamente", 2)
        }
        else {
            mostrarError("Se produjo un error al intentar eliminar de la capa", 2)
        }
        _dicMapServerLayers[capa].refresh();
       
    }


    function modificarFeature(capa,objectid) {
        $('.loading').removeClass("ocultar");
        var graphic = new Graphic();
        graphic.attributes = { "OBJECTID": objectid };
        var inputs = $(".contentPane table tbody tr input[data-editable=true]");//0 es estado pendiente
        $.each(inputs, function (index, input) {
            input = $(input);
            graphic.attributes[input.data("attr")] = input.val();
        });

        _dicFeaturesLayers[capa].applyEdits(null, [graphic], null, function (evt) { modificarFeatureCompletado(true, capa) }, function (evt) { modificarFeatureCompletado(false, capa) });
    }

    function modificarFeatureCompletado(correctamente, capa) {
        $('.loading').addClass("ocultar");
        if (correctamente) {

            mostrarSuccess("Se ha modificado correctamente", 2)
        }
        else {
            mostrarError("Se produjo un error al intentar modificar el elemento", 2)
        }
        _dicMapServerLayers[capa].refresh();
    }


    //https://developers.arcgis.com/javascript/3/sandbox/sandbox.html?sample=ed_attribute_inspector
    function initSelectToolbar(isShapeFile) {

        var layer = isShapeFile ? _shapeFileLayer : _kmlLayer;

        if (isShapeFile) {

            var selectQuery = new Query();

            //_map.on("click", function (evt) {
            //    selectQuery.geometry = evt.mapPoint;
            //    selectQuery.distance = 50;
            //    selectQuery.units = "miles"
            //    selectQuery.returnGeometry = true;
            //    layer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function (features) {
            //        if (features.length > 0) {
            //           // alert("entra aca")
            //            //store the current feature
            //            _updateFeature = features[0];
            //            _map.infoWindow.setTitle("nombre");//features[0].getLayer().name
            //            _map.infoWindow.show(evt.screenPoint, _map.getInfoWindowAnchor(evt.screenPoint));
            //        }
            //        else {
            //            _map.infoWindow.hide();
            //        }
            //    });
            //});


            _map.infoWindow.on("hide", function () {
                layer.clearSelection();
            });


            layer.on('click', function (evt) {
                //alert(JSON.stringify(evt.graphic.attributes))

                //var layerInfos = [
                //    {
                //    'featureLayer': [layer],
                //    'showAttachments': false,
                //    'isEditable': true,
                //    //'fieldInfos': [
                //    //  { 'fieldName': 'Campo', 'isEditable': false, 'label': 'Campo:' },
                //    //  { 'fieldName': 'Valor', 'isEditable': true, 'tooltip': 'Valor', 'label': 'Valor:' }
                //    //]
                //    }
                //];

                ////Initialize Attribute Inspector
                //var attInspector = new AttributeInspector({
                //    layerInfos: layerInfos
                //}, domConstruct.create("div"));


                //var saveButton = new Button({ label: "Save", "class": "saveButton" }, domConstruct.create("div"));
                //domConstruct.place(saveButton.domNode, attInspector.deleteBtn.domNode, "after");

                //saveButton.on("click", function () {
                //    alert("guarda")
                //    _updateFeature.getLayer().applyEdits(null, [_updateFeature], null);
                //});

                ///*attInspector.on("attribute-change", function (evt) {
                //    //store the updates to apply when the save button is clicked
                //    _updateFeature.attributes[evt.fieldName] = evt.fieldValue;
                //});

                //attInspector.on("next", function (evt) {
                //    _updateFeature = evt.feature;
                //    console.log("Next " + _updateFeature.attributes.OBJECTID);
                //});
                //*/
                //attInspector.on("delete", function (evt) {
                //    alert("elimina")
                //    //evt.feature.getLayer().applyEdits(null, null, [evt.feature]);
                //    //_map.infoWindow.hide();
                //});
                //
                //_updateFeature = evt.graphic//features[0];
                //_map.infoWindow.setTitle("nombre");//features[0].getLayer().name
                //_map.infoWindow.setContent(attInspector.domNode)
                //_map.infoWindow.show(evt.screenPoint, _map.getInfoWindowAnchor(evt.screenPoint));

            });

        }
    }

    function initSelectToolbar2(isShapeFile) {

        var layer = isShapeFile ? _shapeFileLayer : _kmlLayer;

        if (isShapeFile) {

            var templatePicker = new TemplatePicker({
                featureLayers: [layer],
                rows: 'auto',
                groupingEnabled: false,
                columns: 2
            }, 'editorDiv');
            templatePicker.startup();


            var layerInfos = [{
                'featureLayer': layer,
                'showAttachments': false,
                'showDeleteButton': false,

            }];

            //define the editor settings
            var settings = {
                map: _map,
                templatePicker: templatePicker,
                //layerInfos: layerInfos
            };
            var params = { settings: settings };
            //Create the editor widget 
            var editorWidget = new Editor(params);
            editorWidget.startup();

        }
    }
    /*EDICION FEATURE*/

    /*SELECT PRODUCTOR*/


    function getProductores(callback) {


        $.ajax({
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            type: 'POST',
            url: "GetUsuarios",
            success: function (response) {
                callback(response)
                //alert(JSON.stringify(response))
            },
            error: function (result) {

            }
        });


    }

    var _dicProductores = {};
    function crearComboProductores(productores) {
    
        var combo = '<div id="selectProductor" class="input-group">' +
               '<span class="input-group-addon">Productor</span>' +
               '<div class="btn-group">' +
                   '<a class="btn btn-default dropdown-toggle btn-select2" data-toggle="dropdown" href="#"><span id="selectedProductor">---</span><span class="caret"></span></a>' +
                   '<ul class="dropdown-menu"> ';


        _dicProductores = {};
        $.each(productores, function (index, productor) {
            combo += '<li><a data-productor=' + productor.IdProductor + ' href="#">' + productor.Nombre + '</a></li>'
            _dicProductores[productor.IdProductor] = productor;
        });


        combo += '</ul></div><input id="chSetProductor" type="checkbox" ></div>';


        var comboProductores = $("#comboProductores");
        if (comboProductores) {
            comboProductores.html("");
            comboProductores.append(combo);
        }

        return combo;
    }

    function asignarProductor(id) {
    
        var productor = _dicProductores[id];
        if (productor) {
            if ($("#chSetProductor").prop("checked")) {

                var layer;

                switch (_esCargaShape) {
                    case 0: layer = _shapeFileLayer; break;
                    case 1: layer = _layerkml; break;
                    case 2: layer = _editionLayer; break;
                }



                $.each(layer.graphics, function (index, graphic) {
                    var attributes = _esCargaShape == 1 ? graphic.myattributes : graphic.attributes;

                    attributes["nomprod"] = productor.Nombre;
                    attributes["celprod"] = productor.Telefono;
                    attributes["idprod"] = productor.IdProductor;

                });
            }
            else {

                if (_selectedGraphic) {

                    var attributes = _esCargaShape == 1 ? _selectedGraphic.myattributes : _selectedGraphic.attributes;

                    attributes["nomprod"] = productor.Nombre;
                    attributes["celprod"] = productor.Telefono;
                    attributes["idprod"] = productor.IdProductor;
                }
            }


            $("#selectedProductor").html(productor.Nombre)
        }



    }
    /*SELECT PRODUCTOR*/


function consultarElementosPendientes() {
    var user;
    //_dicMapServerLayers["PRODUCTOR"].refresh();
    if(_esProductor)
    {
        user = _idUser;
    }
    else{
        user = _userName;
    }

    $.ajax({
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        type: 'POST',
        url: "ConsultarPendientes",
        data: JSON.stringify({ "pIdUsuario": user, "pEsProductor": _esProductor }),//"{message:'hola'}",
        success: function (response) {
            if (response.Exito) {
                activarNotificacion()
            }
            else {
                apagarNotificacion()
            }
        },
        error: function (result) {
            mostrarError("Se produjo un problema al intentar consultar notificaciones", 4)
        }
    });


}

function activarNotificacion(){
    
    if (_esProductor) {
        $("#pagos").addClass("pagosPending");
    }
    else {
        $("#notificar").addClass("pagosPending");
    }
    
}

function apagarNotificacion() {
    if (_esProductor) {
        $("#pagos").removeClass("pagosPending");
    }
    else {
        $("#notificar").removeClass("pagosPending");
    }

}