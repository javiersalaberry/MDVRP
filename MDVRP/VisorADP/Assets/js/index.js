var _initialExtent
var _map
var _navToolbar
var _toggleBaseMap;
var _toc;
var _panActivated = false;
var _kmlLayer
var _shapeFileLayer
var _updateFeature
var _dicFeaturesLayers = {};
var _dicMapServerLayers = {};
var _selectedPolygonSymbol;
var _polygonSymbol;
var _drawToolBar;
var _editToolbar;
var _toolEditionActivada = false;
var _editionLayer;
var _legendLayers
var _geometryService;

var _imageParameters;
var _infoTemplatesProductor
var _infoTemplatesAmbiente
var _infoTemplatesPrescripcion

var _precioXHA;

var URL_Map_ServerProductor;
var URL_Map_ServerAmbiente;
var URL_Map_ServerPrescripcion;

var URL_Servicio_FeatureServiceProductor;
var URL_Servicio_FeatureServiceAmbiente;
var URL_Servicio_FeatureServicePrescripcion;

var URL_Servicio_GeometryService;
var URL_Servicio_Imprimir;

var URL_Mapa_Base;
var BarraBusqueda = 0;
var BarraEdi = 0;

var _layerProductorName = "Datos de polígono";
var _layerAmbienteName = "Estudio de suelos";
var _layerPrescripcionName = "Estudio de prescripción";


//edition
var _esCargaShape=-1;//-1carganada 0cargashape 1 cargakml 2edicion
var _fileName;//guarda el nombre del archivo que se cargo o, si es edicion Poligono o Circulo
var _capa;//nombre de la capa que para buscar en _dicFeaturesLayers
var _current;//este current, corresponde a:
//- cuando es carga de shapefile, a la posicion del grafico seleccionado dentro del array de graficos de la capa _shapeFileLayer
//- cuando es carga de kml, corresponde con la posicion del grafico seleccionado dentro de....el total de graficos de todas las capas posibles que tiene KMLLayer
var _selectedGraphic;// es el grafico seleccionado sobre el cual estamos trabajando
var _kmlCurrent = -1;//corresponde a la posicion dentro de alguna de las capas de KMLLayer
var _layerkml;//es alguna de las capas para la que se selecciono el grafico que coincide con el _kmlCurrent, osea que _layerkml.graphics[_kmlCurrent] daria con _selectedGraphic


function getUrlConfig(callback) {
    $.ajax({
        url: "GetConfig",
        dataType: "json",
        type: "POST",
        error: function () {
            mostrarError("Error al intentar descargar configuraciones del servidor");
        },
        success: function (config) {
            callback(config);
        }
    });
}

$(document).ready(function () {
    $('.loading').removeClass("ocultar");
 
    require([
      "esri/config",
      "esri/InfoTemplate",
      "esri/request",
      "esri/geometry/scaleUtils",
      "esri/layers/FeatureLayer",
      "esri/renderers/SimpleRenderer",
      "esri/symbols/PictureMarkerSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/SimpleLineSymbol",
      "dijit/layout/BorderContainer",
      "dijit/layout/ContentPane",
      //"esri/dijit/Scalebar",
      "esri/SpatialReference",
      "esri/geometry/Extent",
      "esri/layers/GraphicsLayer",
      "esri/tasks/GeometryService",
      "esri/tasks/ProjectParameters",
      "esri/layers/LayerInfo",
      "esri/layers/ImageParameters",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/layers/ArcGISTiledMapServiceLayer",
      "esri/layers/ArcGISImageServiceLayer",
      "esri/layers/GraphicsLayer",
      "esri/toolbars/draw",
      "esri/graphic",
      //"esri/toolbars/edit",
      //"esri/geometry/Point",
      //"esri/geometry/Circle",
      "esri/tasks/GeometryService",
      "esri/tasks/AreasAndLengthsParameters",
      "esri/toolbars/edit",
      "dijit/form/Button",
      "dojo/dom-construct",
      "esri/tasks/query",
      "esri/dijit/AttributeInspector",
      "esri/layers/KMLLayer",
      "esri/map",
      "esri/toolbars/navigation",
      "esri/dijit/Print",
      "esri/tasks/PrintTemplate",
      "esri/tasks/PrintParameters",
      "esri/tasks/PrintTask",
      "esri/dijit/BasemapToggle",
      "esri/dijit/Legend",
      "esri/tasks/LegendLayer",
      //"esri/renderers/UniqueValueRenderer",
      "esri/dijit/editing/TemplatePicker",
      "esri/dijit/editing/Editor",
      "esri/SpatialReference", "esri/geometry/webMercatorUtils",
      "dojo/dom",
      "dojo/json",
      "dojo/on",
      "dojo/ready",
      "dojo/parser",
      "dojo/sniff",
      "dojo/_base/array",
      "esri/Color",
      "dojo/_base/lang",
      //"esri/dijit/Measurement",
      //"esri/units",
      "dojo/domReady!"
    ], function (
        _esriConfig,
        _InfoTemplate,
        _request,
        _scaleUtils,
        _FeatureLayer,
        _SimpleRenderer,
        _PictureMarkerSymbol,
        _SimpleFillSymbol,
        _SimpleLineSymbol,
        _BorderContainer,
        _ContentPane,
        //_Scalebar,
        _SpatialReference,
        _Extent,
        _GraphicsLayer,
        _GeometryService,
        _ProjectParameters,
        _LayerInfo,
        _ImageParameters,
        _ArcGISDynamicMapServiceLayer,
        _ArcGISTiledMapServiceLayer,
        _ArcGISImageServiceLayer,
        _GraphicsLayer,
        _Draw,
        _Graphic,
        _GeometryService, 
        _AreasAndLengthsParameters,
        _Edit,
        //_Point,
        //_Circle,
        _Button,
        _domConstruct,
        _Query,
        _AttributeInspector,
        _KMLLayer,
        _Map,
        _Navigation,
        _Print,
        _PrintTemplate,
        _PrintParameters,
        _PrintTask,
        _BasemapToggle,
        _Legend,
        _LegendLayer,
        //_UniqueValueRenderer,
        //_Measurement,
        //_Units,
        _TemplatePicker,
        _Editor,
        _SpatialReference, _webMercatorUtils,
        _dom, _JSON, on,
        ready,
        parser,
        _sniff,
        _arrayUtils, _Color, _lang
      ) {

        parser.parse();//http://stackoverflow.com/questions/24892585/registry-byid-set-content-returns-unable-to-get-property-set-of-undefined-or-n

        esriConfig = _esriConfig;
        InfoTemplate = _InfoTemplate;
        request = _request;
        scaleUtils = _scaleUtils;
        FeatureLayer = _FeatureLayer;
        SimpleRenderer = _SimpleRenderer;
        PictureMarkerSymbol = _PictureMarkerSymbol;
        SimpleFillSymbol = _SimpleFillSymbol;
        SimpleLineSymbol = _SimpleLineSymbol;
        BorderContainer = _BorderContainer
        ContentPane = _ContentPane
        //Scalebar = _Scalebar
        SpatialReference = _SpatialReference
        Extent = _Extent
        GraphicsLayer = _GraphicsLayer
        GeometryService = _GeometryService
        ProjectParameters = _ProjectParameters
        LayerInfo = _LayerInfo
        ImageParameters=_ImageParameters
        ArcGISDynamicMapServiceLayer = _ArcGISDynamicMapServiceLayer
        ArcGISTiledMapServiceLayer = _ArcGISTiledMapServiceLayer
        ArcGISImageServiceLayer = _ArcGISImageServiceLayer
        GraphicsLayer = _GraphicsLayer
        Draw = _Draw
        Graphic = _Graphic
        GeometryService=_GeometryService,
        AreasAndLengthsParameters=_AreasAndLengthsParameters,
        Edit = _Edit
        //Point = _Point
        //Circle = _Circle
        Button = _Button
        domConstruct = _domConstruct
        Query = _Query
        AttributeInspector = _AttributeInspector
        KMLLayer = _KMLLayer
        Map = _Map
        Navigation = _Navigation
        Print = _Print
        PrintTemplate = _PrintTemplate
        PrintParameters = _PrintParameters
        PrintTask = _PrintTask
        BasemapToggle = _BasemapToggle
        Legend = _Legend
        LegendLayer = _LegendLayer
        //UniqueValueRenderer = _UniqueValueRenderer
        //Measurement = _Measurement
        //Units = _Units
        TemplatePicker = _TemplatePicker
        Editor = _Editor
        SpatialReference = _SpatialReference
        webMercatorUtils = _webMercatorUtils
        dom = _dom
        JSON = _JSON
        sniff = _sniff
        arrayUtils = _arrayUtils
        Color = _Color
        lang = _lang

        getUrlConfig(onGetConfigCompleted)

      

    });

  

});
var _event;
function onGetConfigCompleted(config) {

    if(config.precioPorHectarea)
        _precioXHA = config.precioPorHectarea;

    if (config.urlMapServerProductor)
        URL_Map_ServerProductor = config.urlMapServerProductor;

    if (config.urlMapServerAmbiente)
        URL_Map_ServerAmbiente = config.urlMapServerAmbiente;

    if (config.urlMapServerPrescripcion)
        URL_Map_ServerPrescripcion = config.urlMapServerPrescripcion;

    if (config.urlFeatureLayerProductor)
        URL_Servicio_FeatureServiceProductor = config.urlFeatureLayerProductor;

    if (config.urlFeatureLayerAmbiente)
        URL_Servicio_FeatureServiceAmbiente = config.urlFeatureLayerAmbiente;

    if (config.urlFeatureLayerPrescripcion)
        URL_Servicio_FeatureServicePrescripcion = config.urlFeatureLayerPrescripcion;

    if (config.urlGeometryService)
        URL_Servicio_GeometryService = config.urlGeometryService;

    if (config.urlServicioImpresion)
        URL_Servicio_Imprimir = config.urlServicioImpresion;

    if (config.urlMapaBase)
        URL_Mapa_Base = config.urlMapaBase;

    _initialExtent = new Extent({ "xmin": -6623424.454149952, "ymin": -4108121.479651177, "xmax": -5844378.261867475, "ymax": -3620758.987304917, "spatialReference": { "wkid": 102100 } });
    //_initialExtent = new Extent(115086.37779777427, 6081066.278807361, 1067588.2828015813, 6716067.548809899, new SpatialReference({ "wkid": 32721 }))
    //_initialExtent = new Extent(362468.599, 6125773.9168, 871028.599, 6673453.9168206, new SpatialReference({ "wkid": 32721 }))
    //_map = new Map("mapDiv", {
    //    extent: _initialExtent,
    //    //basemap: "streets"
    //});

    _map = new Map("mapDiv", {
        center: [-56.304514, -32.823400],
        zoom: 8,
        basemap: "hybrid"
    });


    //var mapaBase = new ArcGISTiledMapServiceLayer(URL_Mapa_Base);
    //_map.addLayer(mapaBase)


    _navToolbar = new Navigation(_map);
    _toggleBaseMap = new BasemapToggle({
        map: _map,
        basemap: "osm",
        basemaps: {
            "hybrid": {
                "title": "Satelital",
                "thumbnailUrl": "https://js.arcgis.com/3.17/esri/images/basemap/hybrid.jpg"
            },
            "osm": {
                "title": "Open Street Map",
                "thumbnailUrl": "https://js.arcgis.com/3.17/esri/images/basemap/osm.jpg"
            }
        }
    }, "BasemapToggle");

    //var a1 = 1;

   

    dojo.connect(_map, "onLoad", function () {
        //alert(_map.spatialReference.wkid)

        dojo.connect(_map, "onClick", function (event) {

            // if (a1 == 1)
            _event = event;
            _map.infoWindow.hide();
            //else
            //  _map.infoWindow.show();
        });

        $(_map.infoWindow.domNode).find(".contentPane").addClass("contentMapToolTip")
        $(_map.infoWindow.domNode).find(".titlePane").addClass("titleMapToolTip")

        _toggleBaseMap.startup();

        _toc = new agsjs.dijit.TOC({
            map: _map,
            layerInfos: []
        }, 'legend');

        _drawToolBar = new Draw(_map);
        _drawToolBar.on("draw-end", drawEnd);
        _editToolbar = new Edit(_map);

      
        
             
        _map.on("mouse-up", DragEnd);
        _map.on("mouse-down", DragStart);
        InicializarButtons();
        BarraHerramientas("pan");
        $('.loading').addClass("ocultar");
    });

    dojo.connect(_map, "onClick", function () {
        _map.infoWindow.hide();

        if (_toolEditionActivada) {
            _editToolbar.deactivate();
            _toolEditionActivada = false;
            //evt.stopPropagation();
        }
    });



}

/*FUNCIONES AUXILIARES*/

function projectToWebMercator(geometry) {

    geometry = webMercatorUtils.webMercatorToGeographic(geometry);
}

function dateToTicks(date) {
    return ((date.getTime() * 10000) + 621355968000000000);
}

function formatDate(date) {
    var now = new Date(date);
    var vD = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    var d = new Date(vD),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
 
    return [year, month, day].join('-');  
}



function zoomToGeometry(geometry) {

    if (geometry != null) {
        if (geometry.type == "point")
            _map.centerAndZoom(geometry, _zoom);
        else if (geometry.type == "extent" || geometry.type == "polygon" || geometry.type == "polyline")
            _map.setExtent(geometry.getExtent());
        //_map.centerAndZoom(grafico.geometry.getExtent().getCenter(), _zoom);
    }
}

var _graficosAreaCalculando = []

function calcularArea(grafico,attrName,input) {

    var areasAndLengthParams = new AreasAndLengthsParameters();
    areasAndLengthParams.lengthUnit = GeometryService.UNIT_FOOT;
    areasAndLengthParams.areaUnit = GeometryService.UNIT_HECTARES;
    areasAndLengthParams.calculationType = "geodesic";

    _geometryService.simplify([grafico.geometry], function (simplifiedGeometries) {
        _graficosAreaCalculando.push({ g: grafico, attr: attrName, inp: input });
        areasAndLengthParams.polygons = simplifiedGeometries;
        _geometryService.areasAndLengths(areasAndLengthParams);
    });
}

function calcularAreaTecnico(grafico) {

    var areasAndLengthParams = new AreasAndLengthsParameters();
    areasAndLengthParams.lengthUnit = GeometryService.UNIT_FOOT;
    areasAndLengthParams.areaUnit = GeometryService.UNIT_HECTARES;
    areasAndLengthParams.calculationType = "geodesic";

    _geometryService.simplify([grafico.geometry], function (simplifiedGeometries) {
        _graficosAreaCalculando.push({ g: grafico, attr: "SUP", inp: "" });
        areasAndLengthParams.polygons = simplifiedGeometries;
        _geometryService.areasAndLengths(areasAndLengthParams);
    });
}

function outputAreaAndLength(evtObj) {
    if (_esProductor) {
        var result = evtObj.result;
        //alert(JSON.stringify(result));
        //dom.byId("area").innerHTML = result.areas[0].toFixed(3) + " acres";
        //dom.byId("length").innerHTML = result.lengths[0].toFixed(3) + " feet";
        var elem = _graficosAreaCalculando[0];
        _graficosAreaCalculando.shift();


        if (elem.inp) {//por las dudas   que no haya cerrado la ventana, si la cerro dejo de editar asi que nada me interesa 
            var area = result.areas[0].toFixed(3);
            debugger;
            if (elem.g["myattributes"])
                elem.g["myattributes"][elem.attr] = area//SI ES KML O KMZ
            else
                elem.g.attributes[elem.attr] = area;//SETEO EL AREA AL GRAFICO

            var precioinput = $($("#" + elem.inp.data("auxiliar-input")).find("input"));
            var precio = (_precioXHA * parseFloat(area)).toFixed(2);

            if (elem.g["myattributes"])
                elem.g["myattributes"][precioinput.data("field")] = precio//SI ES KML O KMZ
            else
                elem.g.attributes[precioinput.data("field")] = precio//SETEO PRECIO AL GRAFICO

            if (elem.g === _selectedGraphic) {//actualizo el input tmb
                elem.inp.val(area);//le muestro el area
                precioinput.val(precio);//le muestro el precio
            }
        }
    }
    else {
        var elem = _graficosAreaCalculando[0];
        _graficosAreaCalculando.shift();
        var result = evtObj.result;
        var area = result.areas[0].toFixed(3);
        var attributes1 = {};
        attributes1["sup"] = area;
        $("#sup_tecnico").val(area);
        elem.g.attributes = attributes1;
    }
    

}




function mostrarError(errorMsg, tipo) {


    $('.loading').addClass("ocultar");
    $("#errorMsg").html(errorMsg);
    $("#modalErrorMsg").modal("show");

    switch (tipo) {

        case 0: {//error de carga
            restartCargaArchivo();
            break;
        }
        case 3: {//pago realizado
            _dicMapServerLayers["PRODUCTOR"].refresh()
            break;
        }

    }

}
function mostrarSuccess(successMsg, tipo) {
    $('.loading').addClass("ocultar");
    $("#successMsg").html(successMsg);
    $("#modalSuccessMsg").modal("show");

    switch (tipo) {

        case 2: {//elimino correctamente
            _map.infoWindow.hide();
            break;
        }
        case 3: {//pago realizado
            _dicMapServerLayers["PRODUCTOR"].refresh()
            break;
        }
        case 4: {//Notificacion a productor de tarea completada
            _dicMapServerLayers["AMBIENTE"].refresh()
            break;
        }
        case 5: {//Notificacion a productor de tarea completada
            _dicMapServerLayers["AMBIENTE"].refresh()
            break;
        }
    }

}

function mostrarConfirmacion(accion, msg) {
    $("#modalConfirmBdy").html(msg);
    $("#btnModalConfirmAceptar").data("accion", accion);
    $("#modalConfirmAccion").modal("show");
}

function confirmarAccion(positiva,accion) {

    $("#modalConfirmAccion").modal("hide");

    switch (accion) {
        case 1: {//eliminar feature de capa
            if (positiva)
                eliminarFeature(_capaFeatureAEliminar, _oidFeatureAEliminar);
            else {
                _capaFeatureAEliminar = -1;
                _oidFeatureAEliminar = -1;
            }
            break;
        }
        case 2: {//eliminar feature de capa
            realizarSubida();
            break;
        }        
    }        
}

/*FUNCIONES AUXILIARES*/

/*INICIALIZACION DE BOTONES Y OTRAS COSAS*/
function InicializarButtons() {

    //$("#editorFeatures,#legendDiv").draggable({
    //    handle: ".panel-heading",
    //    containment:"parent"
    //});

    $(document).on("click", ".close", function () {
        var elemClose = $(this).data("element-to-close");

        if (elemClose == "editorFeatures") {
            //BarraEdi = 0;         
            //$("#barraEdicion").css({ "display": "none" });
            restartCargaArchivo();
        }
        $("#" + elemClose).addClass("ocultar")
    });

    $(document).on("click", "#barraMenu button", function () {

        BarraHerramientas($(this).data("tool"));
    });

    $(document).on("click", "#barraEdicion button", function () {

        BarraEdicion($(this).data("tool"));
    });

    $(document).on("click", "#btnSubirAFeatureLayer", function () {

        subirFeatures();
    });
    $(document).on("click", "#btnSubirTodosAFeatureLayer", function () {
        if (_esProductor) {
            subirTodosFeaturesProductor();
        } else {
            $("#modalSubirTodos").modal("show");
        }
    });

    $(document).on("click", "#btnModalSubirAceptar", function () {

        //realizarSubida();
        mostrarConfirmacion(2, "¿Está seguro que desea subir esta geometría con ese número de orden?")
       
      
    });

    $(document).on("click", "#btnBuscarPol", function () {

        zoomNroOrden();

    });





    $(document).on("change", "#btnCargarShapefile", function (e) {

        $("#modalCargaArchivo").modal("hide");
        if (_esProductor) {
            //si es productor tiene una sola capa para editar ya le selecciono la 0
            restartCargaArchivo();
            debugger;
            consultarTipoCapaSelected("PRODUCTOR", 0, e.target.value.toLowerCase());//capa, tipo(shp,kml,edicion que seria 0,1,2), nombre de archivo, que si es edicion va Circulo o Poligono
        }
        else {
            consultarTipoCapa(0, e.target.value.toLowerCase())
        }

    });

    $(document).on("change", "#btnCargarKML", function (e) {

        $("#modalCargaArchivo").modal("hide");
        if (_esProductor) {
            //si es productor tiene una sola capa para editar ya le selecciono la 0
            restartCargaArchivo();
            consultarTipoCapaSelected("PRODUCTOR", 1, e.target.value.toLowerCase());//capa, tipo(shp,kml,edicion que seria 0,1,2), nombre de archivo, que si es edicion va Circulo o Poligono
        }
        else {
            consultarTipoCapa(1, e.target.value.toLowerCase())//
        }

    });
    
    $(document).on('click', "#modalTipoCapa .modal-dialog .modal-content .modal-body input", function () {

        consultarTipoCapaSelected($(this).data("capa"), undefined, undefined);

    });


    $(document).on('hidden.bs.modal', "#modalErrorMsg,#modalSuccessMsg,#modalConfirmAccion,#modalTipoCapa", function () {
        var modal = $(this).data("modalid");
        if (modal == 0) {
            $("#errorMsg").val("");
        }
        else if (modal == 1) {
            $("#successMsg").val("");
        }
        else if (modal == 2) {

        }
        else if (modal == 3) {
            $("#btnCargarKML").val("");
            $("#btnCargarShapefile").val("");
        }
    });

    $(document).on("click", ".btnCurrentFeature", function () {
        handleCurrent($(this));
    });

    $(document).on("change", ".editableFeatureField", function () {
        
        var val = $(this).val();

        //if ($(this).attr("type") == "date")
        //    val = (new Date(val)).toString();

        //debugger;

        changeFeatureAttr($(this).data("field"), val);
    });

    $(document).on("click", "#btnFilterMap", function () {

        filtrarMapa();

        $("#modalFiltrarMapa").modal("hide");
    });

    $(document).on("click", ".eliminarFeature", function () {

        var objectid = $(this).data("featureid");
        var capa = $(this).data("capa");

        _capaFeatureAEliminar = capa;
        _oidFeatureAEliminar = objectid;
        
        mostrarConfirmacion(1,"¿Está seguro que desea eliminar?")
        
    });


    $(document).on("click", ".modificarFeature", function () {

        var objectid = $(this).data("featureid");
        var capa = $(this).data("capa");
        modificarFeature(capa, objectid);

    });


    $(document).on("click", ".prescripcionFeature", function () {

        var objectid = $(this).data("featureid");
        var capa = $(this).data("capa"); 
        var numero_orden = $(this).data("numero_orden");
        prescripcionFeature(capa, objectid, numero_orden);

    });

    $(document).on("click", "#btnModalConfirmAceptar", function () {

        var accion = $(this).data("accion");

        confirmarAccion(true,accion);

    });
    $(document).on("click", "#btnNotificarResultado", function () {

        notificarResultado()       

    });


    //Seteo la posicion de las barras de herramientas para que sea responsive a la pantalla
    var posEd = $("#navEdit").position();
    $("#barraEdicion").css({ top: posEd.top });

    var posBus = $("#navBuscar").position();
    $("#barraBusqueda").css({ top: posBus.top });

}

function DragStart(evt) {

    if (_panActivated) {
        handleMapCursor(2);
    }
}

function DragEnd(evt) {

    if (_panActivated) {
        handleMapCursor(1);
    }

}

function BarraHerramientas(str) {

    if (str == "pan")
        _panActivated = true;
    else
        _panActivated = false;

    switch (str) {
        case "filter": {
            resetFilters();
            $("#modalFiltrarMapa").modal("show");
            break;
        }
        case "pan": {
            _navToolbar.activate(Navigation.PAN);
            handleMapCursor(1);
            if(_drawToolBar)_drawToolBar.deactivate();
            break;
        }
        case "buscar": {

            cargarBusqueda();

            _navToolbar.activate(Navigation.PAN);
            BarraHerramientas("pan");

            break;
        }
        case "zoomin": {
            handleMapCursor(3);
            _navToolbar.activate(Navigation.ZOOM_IN);
            if (_drawToolBar) _drawToolBar.deactivate();
            _map.disablePan()//si va antes de _drawToolBar.deactivate(); da probloemas, se ve que activa nuevmanete el pan
            break;
        }
        case "zoomout": {
            handleMapCursor(4);
            _navToolbar.activate(Navigation.ZOOM_OUT);
            if (_drawToolBar) _drawToolBar.deactivate();
            _map.disablePan()//si va antes de _drawToolBar.deactivate(); da probloemas, se ve que activa nuevmanete el pan
            break;
        }
        case "anterior": {
            _navToolbar.zoomToPrevExtent();
            BarraHerramientas("pan")
            break;
        }
        case "siguiente": {
            _navToolbar.zoomToNextExtent();
            BarraHerramientas("pan")
            break;
        }
        case "fullextent": {
            _map.setExtent(_initialExtent)
            BarraHerramientas("pan")
            break;
        }
        case "imprimir": {
            ImprimirMapa()
            BarraHerramientas("pan")
            break;
        }
        case "cargaArchivo": {
            $("#modalCargaArchivo").modal("show");
            BarraHerramientas("pan")
            break;
        }
        case "pagos": {
            consultarPendientes();
            //ObtenerFormPago();
            BarraHerramientas("pan")
            break;
        }
        case "notificar": {
            notificarEstudios();
            BarraHerramientas("pan")
            break;
        }
        case "edit": {

            //BarraEdi = 1;
            //$("#barraEdicion").css({ "display": "inline-flex" });
          
            if (_esProductor) {
                //si es productor tiene una sola capa para editar ya le habilito la barra de edicion
                restartCargaArchivo();
                consultarTipoCapaSelected("PRODUCTOR", 2, "Poligono");//si es productor, le indica la capa que es la unica que tiene, 2 refiere al tipo de edicion , y donde va null, por defecto le elijo poligono
            }
            else {
           
                consultarTipoCapa(2, "Poligono")
            }


        }
        /**/
    }
}


function ObtenerFormPago(param) {
    $.ajax({
        url: "EjecutarVPOS",
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        type: "POST",
        data: param,
        error: function () {
            mostrarError("Error al intentar generar form de pago");
        },
        success: function (config) {
            var formPAgo = '<form id="targetformapago" target="my_frame" name="frmSolicitudPago" method="POST" action="https://integracion.alignetsac.com/VPOS/MM/transactionStart20.do">';
            formPAgo = formPAgo + '<INPUT TYPE="hidden" NAME="IDACQUIRER" value="' + config.acquirerId + '">';
            formPAgo = formPAgo + '<INPUT TYPE="hidden" NAME="IDCOMMERCE" value="' + config.commerceId + '">';
            formPAgo = formPAgo + '<INPUT TYPE="hidden" NAME="XMLREQ" value="' + config.cipheredXML + '">';
            formPAgo = formPAgo + '<INPUT TYPE="hidden" NAME="DIGITALSIGN" value="' + config.cipheredSignature + '">';
            formPAgo = formPAgo + '<INPUT TYPE="hidden" NAME="SESSIONKEY" value="' + config.cipheredSessionKey + '">';
            formPAgo = formPAgo + '</form>';

            var frame = '<center><iframe name="my_frame"  src="https://integracion.alignetsac.com/VPOS/MM/transactionStart20.do" width="780" height="450"> </iframe></center>';
            $("#FormPagonline").html(formPAgo);
            $("#iframe").html(frame);
            $("#targetformapago").submit();
            $("#modalPagosFrame").modal("show");          
             $('.loading').addClass("ocultar");


         
        }
       
    });
}

function BarraEdicion(str) {


    switch (str) {
        case "polygonEdit": {

            if (_esCargaShape != 2)
                consultarTipoCapaSelected(_capa, 2, "Poligono");
            else {
                _drawToolBar.activate("polygon");
            }
            break;
        }
        case "circleEdit": {

            if (_esCargaShape != 2)
                consultarTipoCapaSelected(_capa, 2, "Circulo");
            else {//ya estaba editando
                _drawToolBar.activate("circle");
            }
            break;
        }
        case "delete": {
            eliminarFeatureEnEdicion();
            break;
        }
        case "undo": {
          
            break;
        }
        case "redo": {
           
            break;
        }
    }
    if (str == "polygonEdit" || str == "circleEdit") {
        
        //LO PONGO EN FALSE PARA CUANDO HAGA DRAG START Y ESO NO CAMBIE POR LA MANITO
        _panActivated = false;

        if (str == "circleEdit") {
            _navToolbar.deactivate();
            _map.disablePan();
        }
        else{
            _navToolbar.activate(Navigation.PAN);
        }
        handleMapCursor();
    }

   

}

//1 manito abierta 2 manito cerrada 3 lupa+ 4 lupa-
function handleMapCursor(cursor) {
    
    //si no estoy editando
    //puede ser manito, lupa + o lupa -
    //si estoy editando
    //graficlayer
        //si _panActivated es false estoy editando pero haciendo pan, puedo seleccionar
    //shape o kml
        //puede ser manito, lupa + o lupa -

    switch (cursor) {

        case 1: 
            _map.setMapCursor("url('../Assets/img/cursors/openhand.cur'),auto");
            break;
        case 2:
            _map.setMapCursor("url('../Assets/img/cursors/closedhand.cur'),auto");
            break;
        case 3:
            _map.setMapCursor("url('../Assets/img/cursors/magnifyIn.cur'),auto");
            break;
        case 4:
            _map.setMapCursor("url('../Assets/img/cursors/magnifyOut.cur'),auto");
            break;
        default: {
            if (_esCargaShape == 2) {
                if (_panActivated)
                    _map.setMapCursor("url('../Assets/img/cursors/openhand.cur'),auto");
                else
                    _map.setMapCursor("default");
            }
            else
                _map.setMapCursor("url('../Assets/img/cursors/openhand.cur'),auto");
            break;
        }
    }


        

}




/*INICIALIZACION DE BOTONES Y OTRAS COSAS*/


/*FILTROS*/

var _filters = {};

/*FILTROS*/



/*IMPRESION MAPA*/

function ImprimirMapa() {

    //esri.config.defaults.io.alwaysUseProxy = false;
    $('.loading').removeClass("ocultar");
    var template = new PrintTemplate();
    template.format = "PDF";
    template.layout = "MAP_ONLY";
    template.exportOptions = {
        width: _map.width,
        height: _map.height
    };

    var params = new PrintParameters();
    params.map = _map;
    params.template = template;
    var printTask = new PrintTask(URL_Servicio_Imprimir);
    //esri.config.defaults.io.timeout = "600000";
    printTask.execute(params, printResult, printError);
}

function printResult(result) {
    $('.loading').addClass("ocultar");
    window.open(result.url);
}
function printError(result) {
    $('.loading').addClass("ocultar");
}




/*IMPRESION MAPA*/

function notificarEstudios()
{
    $("#modalNotificar").modal("show");
}



function cargarBusqueda() {

    if (BarraBusqueda == 0) {
        BarraBusqueda = 1;
        $("#barraBusqueda").css({ "display": "inline-flex" });     
        
    }
    else {
        BarraBusqueda = 0;
        $("#barraBusqueda").css({ "display": "none" });
    }
}


//function cargarBarraEdi() {

//    if (BarraEdi == 0) {
//        BarraEdi = 1;
//        $("#barraEdicion").css({ "display": "inline-flex" });
//    }
//    else {
//        BarraEdi = 0;
//        $("#barraEdicion").
//        $("#barraEdicion").css({ "display": "none" });
//    }
//};


function zoomNroOrden() {

    BarraBusqueda = 0;
    $("#barraBusqueda").css({ "display": "none" });

    var vNumeroOrden = $("#txtBuscarPoligono").val();
    
    var queryTask = new esri.tasks.QueryTask(URL_Map_ServerProductor+ "/0");

    var query = new esri.tasks.Query();
    query.where = "numero_orden = " + vNumeroOrden;
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.outSpatialReference = _map.spatialReference;
    queryTask.executeForExtent(query, ZoomPol);  
   

}


function ZoomPol(response) {

    if (response.count > 0) {
        _map.setExtent(response.extent);
    }
    else {
        mostrarError("No existe un polígono con ese número de orden", 9);
    }
}

