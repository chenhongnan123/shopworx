export default [
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftproduction',
    reportDescription: 'Shift Production',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
      {
        reportObjectname: 'rework',
        reportObjectDesc: 'rework',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
      {
        reportObjectname: 'scrap',
        reportObjectDesc: 'scrap',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
      {
        reportObjectname: 'operatorlog',
        reportObjectDesc: 'operatorlog',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftproduction" Description="Shift production" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="firstcycle" Field="cyclestarttime" /><Key Name="lastcycle" Field="cycleendtime" /><Key Name="shift" Field="shift" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="shift" Field="shiftName" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rework" Collection="rework"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rework&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="shift" Field="shiftName" /><GroupField Name="reworkquantity" Field="reworkquantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="scrap" Collection="scrap"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;scrap&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="shift" Field="shiftName" /><GroupField Name="scrapweight" Field="scrapweight" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="operatorlog" Collection="operatorlog"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;operatorlog&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="operatorcode" Field="operatorcode" /><Key Name="operatorname" Field="operatorname" /><Key Name="machinename" Field="machinename" /><Key Name="shift" Field="shiftName" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *#"production" : [#*
          *##set($cycletime = $resultmap.cycletime)#*
          *##set($rejection = $resultmap.rejection)#*
          *##set($reworkDetails = $resultmap.rework)#*
          *##set($scrapDetails = $resultmap.scrap)#*
          *##set($operatorlog = $resultmap.operatorlog)#*
          *##foreach($cycle in $cycletime)#*
            *##set($shift = '"-"')#*
            *##set($planid = '"-"')#*
            *##set($machinename = '"-"')#*
            *##set($partname = '"-"')#*
            *##set($firstcycle = '"-"')#*
            *##set($lastcycle = '"-"')#*
            *##set($operatorcode = '"-"')#*
            *##set($operatorname = '"-"')#*
            *##set($produced = 0)#*
            *##set($accepted = 0)#*
            *##set($rejected = 0)#*
            *##set($rework = 0)#*
            *##set($scrap = 0)#*
            *##set($machinename = $cycle.get("_id").machinename)#*
            *##set($shift = $cycle.get("_id").shift)#*
            *##set($planid = $cycle.get("_id").planid)#*
            *##set($partname = $cycle.get("_id").partname)#*
            *##set($firstcycle = $cycle.get("_id").firstcycle)#*
            *##set($firstcycle = $math.div($firstcycle, 1))#*
            *##set($lastcycle = $cycle.get("_id").lastcycle)#*
            *##set($lastcycle = $math.div($lastcycle, 1))#*
            *##set($produced = $cycle.get("actualquantity"))#*
            *##foreach($rj in $rejection)#*
              *##if($planid == $rj.get("_id").planid && $partname == $rj.get("_id").partname && $shift == $rj.get("_id").shift)#*
                *##set($rejected = $rj.get("rejectedquantity"))#*
              *##end#*
            *##end#*
            *##foreach($rw in $reworkDetails)#*
              *##if($planid == $rw.get("_id").planid && $partname == $rw.get("_id").partname && $shift == $rw.get("_id").shift)#*
                *##set($rework = $rw.get("reworkquantity"))#*
              *##end#*
            *##end#*
            *##foreach($sc in $scrapDetails)#*
              *##if($planid == $sc.get("_id").planid && $partname == $sc.get("_id").partname && $shift == $sc.get("_id").shift)#*
                *##set($scrap = $sc.get("scrapweight"))#*
              *##end#*
            *##end#*
            *##foreach($op in $operatorlog)#*
              *##if($machinename == $op.get("_id").machinename && $shift == $op.get("_id").shift)#*
                *##set($operatorcode = $op.get("_id").operatorcode)#*
                *##set($operatorname = $op.get("_id").operatorname)#*
              *##end#*
            *##end#*
            *##set($accepted = $math.sub($produced, $rejected))#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
            *#{#*
                *#"machinename": $machinename,#*
                *#"shift": $shift,#*
                *#"firstcycle": $firstcycle,#*
                *#"lastcycle": $lastcycle,#*
                *#"planid": $planid,#*
                *#"partname": $partname,#*
                *#"produced": $produced,#*
                *#"accepted": $accepted,#*
                *#"rejected": $rejected,#*
                *#"rework": $rework,#*
                *#"scrap": $scrap,#*
                *#"operatorcode": $operatorcode,#*
                *#"operatorname": $operatorname#*
            *#}#*
            *##set($count=$count+1)#*
          *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftdowntimebymachine',
    reportDescription: 'Shift downtime by machine',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftdowntimebymachine" Description="Shift downtime by machine" Database="emgda" Host="localhost" Port="27017"><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;complete&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totaldowntime" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shift downtime by machine",#*
      *#"type" : "CHART",#*
      *##set($downtime = $resultmap.downtime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": "Downtime by machine"#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($machinename = $down.get("_id").machinename)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$machinename#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Downtime (in mins)",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($totaldowntimeinms = $down.get("totaldowntime"))#*
          *##set($totaldowntimeinsec = $math.div($totaldowntimeinms, 1000))#*
          *##set($totaldowntimeinmins = $math.div($totaldowntimeinsec, 60))#*
          *##set($totaldowntimeinmins = $math.roundTo(2, $totaldowntimeinmins))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$totaldowntimeinmins#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftdowntimebyreason',
    reportDescription: 'Shift downtime by reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftdowntimebyreason" Description="Shift downtime by reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;complete&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="reasonname" Field="reasonname" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totaldowntime" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shift downtime by reason",#*
      *#"type" : "CHART",#*
      *##set($downtime = $resultmap.downtime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": "Downtime by reason"#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($reasonname = '"No reason"')#*
          *##set($reasonname = $down.get("_id").reasonname)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$reasonname#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Downtime (in mins)",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($totaldowntimeinms = $down.get("totaldowntime"))#*
          *##set($totaldowntimeinsec = $math.div($totaldowntimeinms, 1000))#*
          *##set($totaldowntimeinmins = $math.div($totaldowntimeinsec, 60))#*
          *##set($totaldowntimeinmins = $math.roundTo(2, $totaldowntimeinmins))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$totaldowntimeinmins#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftoee',
    reportDescription: 'Shift Oee',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'machine',
        reportObjectDesc: 'machine',
        reportObjectParameters: [
          'siteid',
        ],
      },
      {
        reportObjectname: 'performance',
        reportObjectDesc: 'performance',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftoee" Description="Shift Oee" Database="emgda" Host="localhost" Port="27017"><DataObject Name="machine" Collection="provisioning"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;machine&quot;"/></Pipeline><Pipeline><Group><Key Name="machinecode" Field="machinecode" /><Key Name="machinename" Field="machinename" /><Key Name="machinecell" Field="machinecell" /></Group></Pipeline></Aggregate></DataObject><DataObject Name="performance" Collection="machinewise-oee-shift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="produced" Field="produced" /><Key Name="target" Field="target" /><Key Name="rejected" Field="rejected" /><Key Name="runtime" Field="runtime" /></Group></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *##set($machines = $resultmap.machine)#*
      *##set($production = $resultmap.cycletime)#*
      *##set($performance = $resultmap.performance)#*
      *##set($downtimes = $resultmap.inProgressDowntime)#*
      *#"machines": [#*
          *##foreach($machine in $machines)#*
            *##set($plancount = 0)#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
            *#{#*
              *##set($machinecode = $machine.get("_id").machinecode)#*
              *##set($machinename = $machine.get("_id").machinename)#*
              *##set($machinecell = $machine.get("_id").machinecell)#*
              *#"machinecode": $machinecode,#*
              *#"machinename": $machinename,#*
              *#"machinecell": $machinecell,#*
              *##set($runtime = 0)#*
              *##set($produced = 0)#*
              *##set($target = 0)#*
              *##set($rejected = 0)#*
              *##set($updatedAt = 0)#*
              *##foreach($perf in $performance)#*
                *##if($machinename == $perf.get("_id").machinename)#*
                  *##set($runtime = $perf.get("_id").runtime)#*
                  *##set($produced = $perf.get("_id").produced)#*
                  *##set($target = $perf.get("_id").target)#*
                  *##set($rejected = $perf.get("_id").rejected)#*
                *##end#*
              *##end#*
              *#"runtime": $runtime,#*
              *#"produced": $produced,#*
              *#"target": $target,#*
              *#"rejected": $rejected#*
            *#}#*
            *##set($count=$count+1)#*
          *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftproductionbymachine',
    reportDescription: 'Shift production by machine',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftproductionbymachine" Description="Shift production by machine" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="machinewise-oee-shift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="produced" Field="produced" /></Group></Pipeline><Pipeline><Sort><SortField Name="produced" SortDirection="Desc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shift production by machine",#*
      *#"type" : "CHART",#*
      *##set($cycletime = $resultmap.cycletime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": "Production by machine"#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($machinename = $cycle.get("_id").machinename)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$machinename#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Production (in pcs)",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($produced = $cycle.get("_id").produced)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$produced#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftrejectionbymachine',
    reportDescription: 'Shift rejection by machine',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftrejectionbymachine" Description="Shift rejection by machine" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><GroupField Name="totalRejection" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totalRejection" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shift rejection by machine",#*
      *#"type" : "CHART",#*
      *##set($rejection = $resultmap.rejection)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": "Rejection by machine"#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($reject in $rejection)#*
          *##set($machinename = $reject.get("_id").machinename)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$machinename#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Total rejections",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($reject in $rejection)#*
          *##set($totalRejection = $reject.get("totalRejection"))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$totalRejection#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftrejectionbyreason',
    reportDescription: 'Shift rejection by reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftrejectionbyreason" Description="Shift rejection by reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="reasonname" Field="reasonname" /><GroupField Name="totalRejection" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totalRejection" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shift rejection by reason",#*
      *#"type" : "CHART",#*
      *##set($rejection = $resultmap.rejection)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": "Rejection by reason"#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($reject in $rejection)#*
          *##set($reasonname = $reject.get("_id").reasonname)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$reasonname#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Total rejections",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($reject in $rejection)#*
          *##set($totalRejection = $reject.get("totalRejection"))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$totalRejection#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shifttargetbymachine',
    reportDescription: 'Shift target by machine',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shifttargetbymachine" Description="Shift target by machine" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="machinewise-oee-shift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="target" Field="target" /></Group></Pipeline><Pipeline><Sort><SortField Name="target" SortDirection="Desc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shift target by machine",#*
      *#"type" : "CHART",#*
      *##set($cycletime = $resultmap.cycletime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": "Target by machine"#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($machinename = $cycle.get("_id").machinename)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$machinename#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Target (in pcs)",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($target = $cycle.get("_id").target)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$target#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlyplancycletimetrend',
    reportDescription: 'Average cycletime trend',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'planFilter',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlyplancycletimetrend" Description="Average cycletime trend" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; planid in planFilter"/></Pipeline><Pipeline><Group><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="cyclesum" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="cyclecount" Field="actm_count" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Average cycletime trend",#*
      *##set($quot = '"')#*
      *##set($concat = '-')#*
      *##set($space = ' ')#*
      *##set($cycletime = $resultmap.cycletime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": ""#*
        *#},#*
        *#"chart": {#*
          *#"type": "areaspline"#*
        *#},#*
        *#"yAxis": {#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#},#*
        *#"xAxis": {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($year = $cycle.get("_id").year)#*
          *##set($month = $cycle.get("_id").month)#*
          *##set($day = $cycle.get("_id").day)#*
          *##set($displayHour = $cycle.get("_id").displayHour)#*
          *##set($displayHour = "$displayHour")#*
          *##set($strlen = $displayHour.length())#*
          *##set($strlen = $math.sub($strlen,1))#*
          *##set($displayHour = $displayHour.substring(1,$strlen))#*
          *##set($date = $day+$concat+$month+$concat+$year)#*
          *##set($category = $quot+$date+$space+$displayHour+$quot)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$category#*
            *##set($count=$count+1)#*
          *##end#*
            *#]#*
        *#},#*
        *#"series" : [{#*
          *#"name" : "Avg. cycletime trend (in secs)",#*
          *#"showInLegend" : false,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($cyclesum = $cycle.get("cyclesum"))#*
          *##set($cyclesum = $math.div($cyclesum, 1000))#*
          *##set($cyclecount = $cycle.get("cyclecount"))#*
          *##set($cyclesum = $math.add($cyclemin, $cyclemax))#*
          *##set($average = $math.div($cyclesum, $cyclecount))#*
          *##set($average = $math.roundTo(2, $average))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$average#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftplancycletimetrend',
    reportDescription: 'Average cycletime trend',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'planFilter',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftplancycletimetrend" Description="Average cycletime trend" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; planid in planFilter"/></Pipeline><Pipeline><Group><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shift" /><GroupField Name="cyclesum" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="cyclecount" Field="actm_count" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Average cycletime trend",#*
      *##set($quot = '"')#*
      *##set($concat = '-')#*
      *##set($space = ' ')#*
      *##set($cycletime = $resultmap.cycletime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": ""#*
        *#},#*
        *#"chart": {#*
          *#"type": "areaspline"#*
        *#},#*
        *#"yAxis": {#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#},#*
        *#"xAxis": {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($year = $cycle.get("_id").year)#*
          *##set($month = $cycle.get("_id").month)#*
          *##set($day = $cycle.get("_id").day)#*
          *##set($shift = $cycle.get("_id").shift)#*
          *##set($shift = "$shift")#*
          *##set($strlen = $shift.length())#*
          *##set($strlen = $math.sub($strlen,1))#*
          *##set($shift = $shift.substring(1,$strlen))#*
          *##set($date = $day+$concat+$month+$concat+$year)#*
          *##set($category = $quot+$date+$space+$shift+$quot)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$category#*
            *##set($count=$count+1)#*
          *##end#*
            *#]#*
        *#},#*
        *#"series" : [{#*
          *#"name" : "Avg. cycletime trend (in secs)",#*
          *#"showInLegend" : false,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($cycle in $cycletime)#*
          *##set($cyclesum = $cycle.get("cyclesum"))#*
          *##set($cyclesum = $math.div($cyclesum, 1000))#*
          *##set($cyclecount = $cycle.get("cyclecount"))#*
          *##set($average = $math.div($cyclesum, $cyclecount))#*
          *##set($average = $math.roundTo(2, $average))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$average#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'plandowntimepareto',
    reportDescription: 'Plan Downtime pareto',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'planFilter',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="plandowntimepareto" Description="Plan Downtime pareto" Database="emgda" Host="localhost" Port="27017"><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; status == &quot;complete&quot; &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; planid in planFilter"/></Pipeline><Pipeline><Group><Key Name="downtimereason" Field="reasonname" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totaldowntime" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Plan Downtime pareto",#*
      *##set($downtimesuminsec = 0)#*
      *##set($quot = '"')#*
      *##set($sep = ':')#*
      *##set($downtime = $resultmap.downtime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": ""#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($downtimereason = '"No reason"')#*
          *##set($downtimereason = $down.get("_id").downtimereason)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$downtimereason#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Downtime (in mins)",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($totaldowntimeinms = $down.get("totaldowntime"))#*
          *##set($totaldowntimeinsec = $math.div($totaldowntimeinms, 1000))#*
          *##set($totaldowntimeinmins = $math.div($totaldowntimeinsec, 60))#*
          *##set($totaldowntimeinmins = $math.roundTo(2, $totaldowntimeinmins))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$totaldowntimeinmins#*
          *##set($downtimesuminsec=$math.add($downtimesuminsec, $totaldowntimeinsec))#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#},#*
        *##set($h = $math.div($downtimesuminsec, 3600))#*
        *##set($h = $math.floor($h))#*
        *##set($m = $math.mod($downtimesuminsec, 3600))#*
        *##set($m = $math.div($m, 60))#*
        *##set($m = $math.floor($m))#*
        *##set($s = $math.mod($downtimesuminsec, 3600))#*
        *##set($s = $math.mod($s, 60))#*
        *##set($s = $math.floor($s))#*
        *##set($totaldowntime = $quot+$h+$sep+$m+$sep+$s+$quot)#*
      *#"totalDowntime" : $totaldowntime#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'planrejectionpareto',
    reportDescription: 'Plan Rejection pareto',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'planFilter',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="planrejectionpareto" Description="Plan Rejection pareto" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; planid in planFilter"/></Pipeline><Pipeline><Group><Key Name="rejectionreason" Field="reasonname" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="rejectedquantity" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Rejection pareto",#*
      *##set($rejectionsum = 0)#*
      *##set($rejection = $resultmap.rejection)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": ""#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($rej in $rejection)#*
          *##set($rejectionreason = '"No reason"')#*
          *##set($rejectionreason = $rej.get("_id").rejectionreason)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$rejectionreason#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Rejection",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($rej in $rejection)#*
          *##set($rejectedquantity = $rej.get("rejectedquantity"))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$rejectedquantity#*
          *##set($rejectionsum=$math.add($rejectionsum, $rejectedquantity))#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#},#*
      *#"totalRejection" : $rejectionsum#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'plansummary',
    reportDescription: 'Plan Summary',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'planFilter',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="plansummary" Description="Plan Summary" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateplan"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; planid in planFilter"/></Pipeline><Pipeline><Group><Key Name="partname" Field="partname" /><Key Name="cavity" Field="cavity" /><GroupField Name="produced" Field="qty" GroupFunction="Sum" /><GroupField Name="cyclesum" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="cyclecount" Field="actm_count" GroupFunction="Sum" /><GroupField Name="runtime" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="updatedAt" Field="updatedAt" GroupFunction="First" /></Group></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `[#*
      *##set($count = 0)#*
      *##set($cycletime = $resultmap.cycletime)#*
      *##foreach($cycle in $cycletime)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
            *##set($runtime = $$cycle.get("runtime"))#*
            *##set($updatedAt = $$cycle.get("updatedAt"))#*
            *##set($cyclesum = $cycle.get("cyclesum"))#*
            *##set($cyclesum = $math.div($cyclesum, 1000))#*
            *##set($cyclecount = $cycle.get("cyclecount"))#*
            *##set($average = $math.div($cyclesum, $cyclecount))#*
            *##set($average = $math.roundTo(2, $average))#*
            *##set($partname = $cycle.get("_id").partname)#*
            *##set($cavity = $cycle.get("_id").cavity)#*
            *##set($produced = $cycle.get("produced"))#*
            *#"partname": $partname,#*
            *#"runtime": $runtime,#*
            *#"averagecycletime": $average,#*
            *#"updatedAt": $updatedAt,#*
            *#"cavity": $cavity,#*
            *#"actualquantity": $produced#*
        *#}#*
        *##set($count=$count+1)#*
      *##end#*#*
    *#]`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlyproductionlog',
    reportDescription: 'Hourly production log',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
          'planVal',
          'partVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlyproductionlog" Description="Hourly production log" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal &amp;&amp; planid == planVal &amp;&amp; partname == partVal"/></Pipeline><Pipeline><Group><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *#"production" : [#*
          *##set($cycletime = $resultmap.cycletime)#*
          *##foreach($cycle in $cycletime)#*
            *##set($hour = '"-"')#*
            *##set($displayHour = '"-"')#*
            *##set($produced = 0)#*
            *##set($hour = $cycle.get("_id").hour)#*
            *##set($displayHour = $cycle.get("_id").displayHour)#*
            *##set($produced = $cycle.get("actualquantity"))#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
            *#{#*
                *#"hour": $hour,#*
                *#"displayhour": $displayHour,#*
                *#"produced": $produced#*
            *#}#*
            *##set($count=$count+1)#*
          *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwiseproductionlog',
    reportDescription: 'Shift wise production log',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
        ],
      },
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'dateVal',
        ],
      },
      {
        reportObjectname: 'rework',
        reportObjectDesc: 'rework',
        reportObjectParameters: [
          'siteid',
          'dateVal',
        ],
      },
      {
        reportObjectname: 'scrap',
        reportObjectDesc: 'scrap',
        reportObjectParameters: [
          'siteid',
          'dateVal',
        ],
      },
      {
        reportObjectname: 'operatorlog',
        reportObjectDesc: 'operatorlog',
        reportObjectParameters: [
          'siteid',
          'dateVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwiseproductionlog" Description="Shift wise production log" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date == dateVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="firstcycle" Field="cyclestarttime" /><Key Name="lastcycle" Field="cycleendtime" /><Key Name="shift" Field="shift" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; date == dateVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="shift" Field="shiftName" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rework" Collection="rework"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rework&quot; &amp;&amp; date == dateVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="shift" Field="shiftName" /><GroupField Name="reworkquantity" Field="reworkquantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="scrap" Collection="scrap"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;scrap&quot; &amp;&amp; date == dateVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="shift" Field="shiftName" /><GroupField Name="scrapweight" Field="scrapweight" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="operatorlog" Collection="operatorlog"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;operatorlog&quot; &amp;&amp; date == dateVal"/></Pipeline><Pipeline><Group><Key Name="operatorcode" Field="operatorcode" /><Key Name="operatorname" Field="operatorname" /><Key Name="machinename" Field="machinename" /><Key Name="shift" Field="shiftName" /></Group></Pipeline><Pipeline><Sort><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *#"production" : [#*
          *##set($cycletime = $resultmap.cycletime)#*
          *##set($rejection = $resultmap.rejection)#*
          *##set($reworkDetails = $resultmap.rework)#*
          *##set($scrapDetails = $resultmap.scrap)#*
          *##set($operatorlog = $resultmap.operatorlog)#*
          *##foreach($cycle in $cycletime)#*
            *##set($shift = '"-"')#*
            *##set($planid = '"-"')#*
            *##set($machinename = '"-"')#*
            *##set($partname = '"-"')#*
            *##set($firstcycle = '"-"')#*
            *##set($lastcycle = '"-"')#*
            *##set($operatorcode = '"-"')#*
            *##set($operatorname = '"-"')#*
            *##set($produced = 0)#*
            *##set($accepted = 0)#*
            *##set($rejected = 0)#*
            *##set($rework = 0)#*
            *##set($scrap = 0)#*
            *##set($machinename = $cycle.get("_id").machinename)#*
            *##set($shift = $cycle.get("_id").shift)#*
            *##set($planid = $cycle.get("_id").planid)#*
            *##set($partname = $cycle.get("_id").partname)#*
            *##set($firstcycle = $cycle.get("_id").firstcycle)#*
            *##set($firstcycle = $math.div($firstcycle, 1))#*
            *##set($lastcycle = $cycle.get("_id").lastcycle)#*
            *##set($lastcycle = $math.div($lastcycle, 1))#*
            *##set($produced = $cycle.get("actualquantity"))#*
            *##foreach($rj in $rejection)#*
              *##if($planid == $rj.get("_id").planid && $partname == $rj.get("_id").partname && $shift == $rj.get("_id").shift)#*
                *##set($rejected = $rj.get("rejectedquantity"))#*
              *##end#*
            *##end#*
            *##foreach($rw in $reworkDetails)#*
              *##if($planid == $rw.get("_id").planid && $partname == $rw.get("_id").partname && $shift == $rw.get("_id").shift)#*
                *##set($rework = $rw.get("reworkquantity"))#*
              *##end#*
            *##end#*
            *##foreach($sc in $scrapDetails)#*
              *##if($planid == $sc.get("_id").planid && $partname == $sc.get("_id").partname && $shift == $sc.get("_id").shift)#*
                *##set($scrap = $sc.get("scrapweight"))#*
              *##end#*
            *##end#*
            *##foreach($op in $operatorlog)#*
              *##if($machinename == $op.get("_id").machinename && $shift == $op.get("_id").shift)#*
                *##set($operatorcode = $op.get("_id").operatorcode)#*
                *##set($operatorname = $op.get("_id").operatorname)#*
              *##end#*
            *##end#*
            *##set($accepted = $math.sub($produced, $rejected))#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
            *#{#*
                *#"machinename": $machinename,#*
                *#"shift": $shift,#*
                *#"firstcycle": $firstcycle,#*
                *#"lastcycle": $lastcycle,#*
                *#"planid": $planid,#*
                *#"partname": $partname,#*
                *#"produced": $produced,#*
                *#"accepted": $accepted,#*
                *#"rejected": $rejected,#*
                *#"rework": $rework,#*
                *#"scrap": $scrap,#*
                *#"operatorcode": $operatorcode,#*
                *#"operatorname": $operatorname#*
            *#}#*
            *##set($count=$count+1)#*
          *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlyliveshopfloor',
    reportDescription: 'Hourly Live Shopfloor',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'machine',
        reportObjectDesc: 'machine',
        reportObjectParameters: [
          'siteid',
        ],
      },
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'hourVal',
        ],
      },
      {
        reportObjectname: 'performance',
        reportObjectDesc: 'performance',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'hourVal',
        ],
      },
      {
        reportObjectname: 'inProgressDowntime',
        reportObjectDesc: 'inProgressDowntime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'hourVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlyliveshopfloor" Description="Hourly Live Shopfloor" Database="emgda" Host="localhost" Port="27017"><DataObject Name="machine" Collection="provisioning"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;machine&quot;"/></Pipeline><Pipeline><Group><Key Name="machinecode" Field="machinecode" /><Key Name="machinename" Field="machinename" /><Key Name="machinecell" Field="machinecell" /></Group></Pipeline></Aggregate></DataObject><DataObject Name="cycletime" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date == dateVal &amp;&amp; hour == hourVal"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="machinename" Field="machinename" /><Key Name="partname" Field="partname" /><Key Name="hourlyAvailableTime" Field="hourlyAvailableTime" /><Key Name="updatedAtTimestamp" Field="updatedAtTimestamp" /><GroupField Name="produced" Field="qty" GroupFunction="Sum" /><GroupField Name="stdcycletime" Field="sctm" GroupFunction="Last" /><GroupField Name="activecavity" Field="activecavity" GroupFunction="Last" /></Group></Pipeline><Pipeline><Sort><SortField Name="updatedAtTimestamp" SortDirection="Desc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="performance" Collection="machinewise-oee-hourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date == dateVal &amp;&amp; hour == hourVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="performance" Field="performance" /><Key Name="quality" Field="quality" /><Key Name="runtime" Field="runtime" /><Key Name="updatedAt" Field="updatedAtTimestamp" /></Group></Pipeline></Aggregate></DataObject><DataObject Name="inProgressDowntime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;inProgress&quot; &amp;&amp; date == dateVal &amp;&amp; hour == hourVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="downtimestart" Field="downtimestart" /><Key Name="actualdowntimestart" Field="actualdowntimestart" /><Key Name="downtimereason" Field="reasonname" /></Group></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *##set($machines = $resultmap.machine)#*
      *##set($production = $resultmap.cycletime)#*
      *##set($performance = $resultmap.performance)#*
      *##set($downtimes = $resultmap.inProgressDowntime)#*
      *#"machines": [#*
          *##foreach($machine in $machines)#*
            *##set($plancount = 0)#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
            *#{#*
              *##set($machinecode = $machine.get("_id").machinecode)#*
              *##set($machinename = $machine.get("_id").machinename)#*
              *##set($machinecell = $machine.get("_id").machinecell)#*
              *#"machinecode": $machinecode,#*
              *#"machinename": $machinename,#*
              *#"machinecell": $machinecell,#*
              *##set($machinestatus = '"NOPLAN"')#*
              *##set($runtime = 0)#*
              *##set($p = 0)#*
              *##set($q = 0)#*
              *##set($updatedAt = 0)#*
              *##foreach($perf in $performance)#*
                *##if($machinename == $perf.get("_id").machinename)#*
                  *##set($runtime = $perf.get("_id").runtime)#*
                  *##set($p = $perf.get("_id").performance)#*
                  *##set($q = $perf.get("_id").quality)#*
                  *##set($updatedAt = $perf.get("_id").updatedAt)#*
                *##end#*
              *##end#*
              *#"runtime": $runtime,#*
              *#"performance": $p,#*
              *#"quality": $q,#*
              *#"updatedAt": $updatedAt,#*
              *#"production": [#*
                *##set($selectedPlan = '"-"')#*
                *##foreach($prod in $production)#*
                  *##if($machinename == $prod.get("_id").machinename)#*
                    *##set($planid = $prod.get("_id").planid)#*
                    *##if($selectedPlan != '"-"' && $selectedPlan != $planid)#*
                      *##break#*
                    *##end#*
                    *##set($selectedPlan = $planid)#*
                    *##if($plancount > 0)#* 
                      *#,#* 
                    *##end#*
                    *#{#*
                      *##set($machinestatus = '"UP"')#*
                      *##set($partname = $prod.get("_id").partname)#*
                      *##set($produced = $prod.get("produced"))#*
                      *##set($stdcycletime = $prod.get("stdcycletime"))#*
                      *##set($activecavity = $prod.get("activecavity"))#*
                      *##set($hourlyAvailableTime = $prod.get("_id").hourlyAvailableTime)#*
                      *##set($hourlyAvailableTime = "$hourlyAvailableTime")#*
                      *##set($strlen = $hourlyAvailableTime.length())#*
                      *##set($strlen = $math.sub($strlen,1))#*
                      *##set($hourlyAvailableTime = $hourlyAvailableTime.substring(1,$strlen))#*
                      *##set($timeTarget = $math.div($hourlyAvailableTime, $stdcycletime))#*
                      *##set($timeTarget = $math.floor($timeTarget))#*
                      *##set($timeTarget = $math.mul($timeTarget, $activecavity))#*
                      *#"planid": $planid,#*
                      *#"partname": $partname,#*
                      *#"produced": $produced,#*
                      *#"timeTarget": $timeTarget#*
                    *#}#*
                    *##set($plancount=$plancount+1)#*
                  *##end#*
                *##end#*
              *#],#*
              *##set($downsince = '"-"')#*
              *##set($downtimestart = '"-"')#*
              *##set($downreason = '"No reason"')#*
              *##foreach($downtime in $downtimes)#*
                *##if($machinename == $downtime.get("_id").machinename)#*
                  *##set($machinestatus = '"DOWN"')#*
                  *##set($downsince = $downtime.get("_id").actualdowntimestart)#*
                  *##set($downtimestart = $downtime.get("_id").downtimestart)#*
                  *##set($downreason = $downtime.get("_id").downtimereason)#*
                *##end#*
              *##end#*
              *#"downtimestart": $downtimestart,#*
              *#"downsince": $downsince,#*
              *#"downreason": $downreason,#*
              *#"machinestatus": $machinestatus#*
            *#}#*
            *##set($count=$count+1)#*
          *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftliveshopfloor',
    reportDescription: 'Shift wise Live Shopfloor',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'machine',
        reportObjectDesc: 'machine',
        reportObjectParameters: [
          'siteid',
        ],
      },
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
      {
        reportObjectname: 'performance',
        reportObjectDesc: 'performance',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
      {
        reportObjectname: 'inProgressDowntime',
        reportObjectDesc: 'inProgressDowntime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'shiftVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftliveshopfloor" Description="Shift wise Live Shopfloor" Database="emgda" Host="localhost" Port="27017"><DataObject Name="machine" Collection="provisioning"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;machine&quot;"/></Pipeline><Pipeline><Group><Key Name="machinecode" Field="machinecode" /><Key Name="machinename" Field="machinename" /><Key Name="machinecell" Field="machinecell" /></Group></Pipeline></Aggregate></DataObject><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="machinename" Field="machinename" /><Key Name="partname" Field="partname" /><Key Name="shiftAvailableTime" Field="shiftAvailableTime" /><Key Name="updatedAtTimestamp" Field="updatedAtTimestamp" /><GroupField Name="produced" Field="qty" GroupFunction="Sum" /><GroupField Name="stdcycletime" Field="sctm" GroupFunction="Last" /><GroupField Name="activecavity" Field="activecavity" GroupFunction="Last" /></Group></Pipeline><Pipeline><Sort><SortField Name="updatedAtTimestamp" SortDirection="Desc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="performance" Collection="machinewise-oee-shift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="performance" Field="performance" /><Key Name="quality" Field="quality" /><Key Name="runtime" Field="runtime" /><Key Name="updatedAt" Field="updatedAtTimestamp" /></Group></Pipeline></Aggregate></DataObject><DataObject Name="inProgressDowntime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;inProgress&quot; &amp;&amp; date == dateVal &amp;&amp; shiftName == shiftVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="downtimestart" Field="downtimestart" /><Key Name="actualdowntimestart" Field="actualdowntimestart" /><Key Name="downtimereason" Field="reasonname" /></Group></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *##set($machines = $resultmap.machine)#*
      *##set($production = $resultmap.cycletime)#*
      *##set($performance = $resultmap.performance)#*
      *##set($downtimes = $resultmap.inProgressDowntime)#*
      *#"machines": [#*
          *##foreach($machine in $machines)#*
            *##set($plancount = 0)#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
            *#{#*
              *##set($machinecode = $machine.get("_id").machinecode)#*
              *##set($machinename = $machine.get("_id").machinename)#*
              *##set($machinecell = $machine.get("_id").machinecell)#*
              *#"machinecode": $machinecode,#*
              *#"machinename": $machinename,#*
              *#"machinecell": $machinecell,#*
              *##set($machinestatus = '"NOPLAN"')#*
              *##set($runtime = 0)#*
              *##set($p = 0)#*
              *##set($q = 0)#*
              *##set($updatedAt = 0)#*
              *##foreach($perf in $performance)#*
                *##if($machinename == $perf.get("_id").machinename)#*
                  *##set($runtime = $perf.get("_id").runtime)#*
                  *##set($p = $perf.get("_id").performance)#*
                  *##set($q = $perf.get("_id").quality)#*
                  *##set($updatedAt = $perf.get("_id").updatedAt)#*
                *##end#*
              *##end#*
              *#"runtime": $runtime,#*
              *#"performance": $p,#*
              *#"quality": $q,#*
              *#"updatedAt": $updatedAt,#*
              *#"production": [#*
                *##set($selectedPlan = '"-"')#*
                *##foreach($prod in $production)#*
                  *##if($machinename == $prod.get("_id").machinename)#*
                    *##set($planid = $prod.get("_id").planid)#*
                    *##if($selectedPlan != '"-"' && $selectedPlan != $planid)#*
                      *##break#*
                    *##end#*
                    *##set($selectedPlan = $planid)#*
                    *##if($plancount > 0)#* 
                      *#,#* 
                    *##end#*
                    *#{#*
                      *##set($machinestatus = '"UP"')#*
                      *##set($partname = $prod.get("_id").partname)#*
                      *##set($produced = $prod.get("produced"))#*
                      *##set($stdcycletime = $prod.get("stdcycletime"))#*
                      *##set($activecavity = $prod.get("activecavity"))#*
                      *##set($shiftavailabletime = $prod.get("_id").shiftAvailableTime)#*
                      *##set($shiftavailabletime = "$shiftavailabletime")#*
                      *##set($strlen = $shiftavailabletime.length())#*
                      *##set($strlen = $math.sub($strlen,1))#*
                      *##set($shiftavailabletime = $shiftavailabletime.substring(1,$strlen))#*
                      *##set($timeTarget = $math.div($shiftavailabletime, $stdcycletime))#*
                      *##set($timeTarget = $math.floor($timeTarget))#*
                      *##set($timeTarget = $math.mul($timeTarget, $activecavity))#*
                      *#"planid": $planid,#*
                      *#"partname": $partname,#*
                      *#"produced": $produced,#*
                      *#"timeTarget": $timeTarget#*
                    *#}#*
                    *##set($plancount=$plancount+1)#*
                  *##end#*
                *##end#*
              *#],#*
              *##set($downsince = '"-"')#*
              *##set($downtimestart = '"-"')#*
              *##set($downreason = '"No reason"')#*
              *##foreach($downtime in $downtimes)#*
                *##if($machinename == $downtime.get("_id").machinename)#*
                  *##set($machinestatus = '"DOWN"')#*
                  *##set($downsince = $downtime.get("_id").actualdowntimestart)#*
                  *##set($downtimestart = $downtime.get("_id").downtimestart)#*
                  *##set($downreason = $downtime.get("_id").downtimereason)#*
                *##end#*
              *##end#*
              *#"downtimestart": $downtimestart,#*
              *#"downsince": $downsince,#*
              *#"downreason": $downreason,#*
              *#"machinestatus": $machinestatus#*
            *#}#*
            *##set($count=$count+1)#*
          *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlyenergydashboard',
    reportDescription: 'Hourly Energy Dashboard',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'meter',
        reportObjectDesc: 'meter',
        reportObjectParameters: [
          'siteid',
        ],
      },
      {
        reportObjectname: 'energy',
        reportObjectDesc: 'energy',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'hourVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlyenergydashboard" Description="Hourly Energy Dashboard" Database="emgda" Host="localhost" Port="27017"><DataObject Name="meter" Collection="provisioning"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;meter&quot;"/></Pipeline><Pipeline><Group><Key Name="metercode" Field="metercode" /><Key Name="metername" Field="metername" /><Key Name="metergroup" Field="metergroup" /></Group></Pipeline></Aggregate></DataObject><DataObject Name="energy" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;utility&quot; &amp;&amp; date == dateVal &amp;&amp; hour == hourVal"/></Pipeline><Pipeline><Group><Key Name="metername" Field="metername" /><Key Name="metercode" Field="metercode" /><Key Name="meterstatus" Field="meterstatus" /><Key Name="updatedAtTimestamp" Field="updatedAtTimestamp" /><GroupField Name="kwh" Field="kwh" GroupFunction="First" /><GroupField Name="kvah" Field="kvah" GroupFunction="First" /><GroupField Name="current" Field="current" GroupFunction="First" /><GroupField Name="vll" Field="vll" GroupFunction="First" /><GroupField Name="vln" Field="vln" GroupFunction="First" /><GroupField Name="pf" Field="pf" GroupFunction="First" /><GroupField Name="consumption" Field="kwh_sum" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="updatedAtTimestamp" SortDirection="Desc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *##set($meters = $resultmap.meter)#*
      *##set($energy = $resultmap.energy)#*
      *#"meters": [#*
        *##foreach($meter in $meters)#*
          *##set($plancount = 0)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#{#*
            *##set($metercode = $meter.get("_id").metercode)#*
            *##set($metername = $meter.get("_id").metername)#*
            *##set($metergroup = $meter.get("_id").metergroup)#*
            *#"metercode": $metercode,#*
            *#"metername": $metername,#*
            *#"metergroup": $metergroup,#*
            *##set($meterstatus = 1)#*
            *##set($current = 0)#*
            *##set($vll = 0)#*
            *##set($vln = 0)#*
            *##set($pf = 0)#*
            *##set($kwh = 0)#*
            *##set($kvah = 0)#*
            *##set($consumption = 0)#*
            *##set($updatedAt = 0)#*
            *##foreach($e in $energy)#*
              *##if($metername == $e.get("_id").metername)#*
                *##set($current = $e.get("current"))#*
                *##set($vll = $e.get("vll"))#*
                *##set($vln = $e.get("vln"))#*
                *##set($pf = $e.get("pf"))#*
                *##set($kwh = $e.get("kwh"))#*
                *##set($kvah = $e.get("kvah"))#*
                *##set($consumption = $e.get("consumption"))#*
                *##set($meterstatus = $e.get("_id").meterstatus)#*
                *##set($updatedAt = $e.get("_id").updatedAt)#*
              *##end#*
            *##end#*
            *#"current": $current,#*
            *#"vll": $vll,#*
            *#"vln": $vln,#*
            *#"pf": $pf,#*
            *#"kwh": $kwh,#*
            *#"kvah": $kvah,#*
            *#"consumption": $consumption,#*
            *#"meterstatus": $meterstatus,#*
            *#"updatedAt": $updatedAt#*
          *#}#*
          *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftenergydashboard',
    reportDescription: 'Shift wise Energy Dashboard',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'meter',
        reportObjectDesc: 'meter',
        reportObjectParameters: [
          'siteid',
        ],
      },
      {
        reportObjectname: 'energy',
        reportObjectDesc: 'energy',
        reportObjectParameters: [
          'siteid',
          'dateVal',
          'hourVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftenergydashboard" Description="Shift wise Energy Dashboard" Database="emgda" Host="localhost" Port="27017"><DataObject Name="meter" Collection="provisioning"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;meter&quot;"/></Pipeline><Pipeline><Group><Key Name="metercode" Field="metercode" /><Key Name="metername" Field="metername" /><Key Name="metergroup" Field="metergroup" /></Group></Pipeline></Aggregate></DataObject><DataObject Name="energy" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;utility&quot; &amp;&amp; date == dateVal &amp;&amp; shift == shiftVal"/></Pipeline><Pipeline><Group><Key Name="metername" Field="metername" /><Key Name="metercode" Field="metercode" /><Key Name="meterstatus" Field="meterstatus" /><Key Name="updatedAtTimestamp" Field="updatedAtTimestamp" /><GroupField Name="kwh" Field="kwh" GroupFunction="First" /><GroupField Name="kvah" Field="kvah" GroupFunction="First" /><GroupField Name="current" Field="current" GroupFunction="First" /><GroupField Name="vll" Field="vll" GroupFunction="First" /><GroupField Name="vln" Field="vln" GroupFunction="First" /><GroupField Name="pf" Field="pf" GroupFunction="First" /><GroupField Name="consumption" Field="kwh_sum" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="updatedAtTimestamp" SortDirection="Desc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *##set($count = 0)#*
      *##set($meters = $resultmap.meter)#*
      *##set($energy = $resultmap.energy)#*
      *#"meters": [#*
        *##foreach($meter in $meters)#*
          *##set($plancount = 0)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#{#*
            *##set($metercode = $meter.get("_id").metercode)#*
            *##set($metername = $meter.get("_id").metername)#*
            *##set($metergroup = $meter.get("_id").metergroup)#*
            *#"metercode": $metercode,#*
            *#"metername": $metername,#*
            *#"metergroup": $metergroup,#*
            *##set($meterstatus = 1)#*
            *##set($current = 0)#*
            *##set($vll = 0)#*
            *##set($vln = 0)#*
            *##set($pf = 0)#*
            *##set($kwh = 0)#*
            *##set($kvah = 0)#*
            *##set($consumption = 0)#*
            *##set($updatedAt = 0)#*
            *##foreach($e in $energy)#*
              *##if($metername == $e.get("_id").metername)#*
                *##set($current = $e.get("current"))#*
                *##set($vll = $e.get("vll"))#*
                *##set($vln = $e.get("vln"))#*
                *##set($pf = $e.get("pf"))#*
                *##set($kwh = $e.get("kwh"))#*
                *##set($kvah = $e.get("kvah"))#*
                *##set($consumption = $e.get("consumption"))#*
                *##set($meterstatus = $e.get("_id").meterstatus)#*
                *##set($updatedAt = $e.get("_id").updatedAt)#*
              *##end#*
            *##end#*
            *#"current": $current,#*
            *#"vll": $vll,#*
            *#"vln": $vln,#*
            *#"pf": $pf,#*
            *#"kwh": $kwh,#*
            *#"kvah": $kvah,#*
            *#"consumption": $consumption,#*
            *#"meterstatus": $meterstatus,#*
            *#"updatedAt": $updatedAt#*
          *#}#*
          *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlymachineproduction',
    reportDescription: 'Hourly Machine Production',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlymachineproduction" Description="Hourly Machine Production" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /><GroupField Name="runtime" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="stdcycletime" Field="sctm" GroupFunction="First" /><GroupField Name="cavity" Field="cavity" GroupFunction="First" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Hourly Machine Production",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date", "description_cn":"日期"},#*
        *#{"name": "hour", "type": "String", "description": "Hour"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "planid", "type": "String", "description": "Plan"},#*
        *#{"name": "partname", "type": "String", "description": "Part"},#*
        *#{"name": "target", "type": "Long", "description": "Target"},#*
        *#{"name": "produced", "type": "Long", "description": "Produced"},#*
        *#{"name": "accepted", "type": "Long", "description": "Accepted"},#*
        *#{"name": "rejected", "type": "Long", "description": "Rejected"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##foreach($cycle in $cycletime)#*
        *##set($planid = '"-"')#*
        *##set($machinename = '"-"')#*
        *##set($equipmentname = '"-"')#*
        *##set($partname = '"-"')#*
        *##set($moldname = '"-"')#*
        *##set($toolname = '"-"')#*
        *##set($trial = false)#*
        *##set($cavity = 1)#*
        *##set($runtime = 0)#*
        *##set($stdcycletime = 0)#*
        *##set($target = 0)#*
        *##set($produced = 0)#*
        *##set($accepted = 0)#*
        *##set($rejected = 0)#*
        *##set($year = $cycle.get("_id").year)#*
        *##set($month = $cycle.get("_id").month)#*
        *##set($day = $cycle.get("_id").day)#*
        *##set($hour = $cycle.get("_id").hour)#*
        *##set($displayHour = $cycle.get("_id").displayHour)#*
        *##set($planid = $cycle.get("_id").planid)#*
        *##set($partname = $cycle.get("_id").partname)#*
        *##set($machinename = $cycle.get("_id").machinename)#*
        *##set($produced = $cycle.get("actualquantity"))#*
        *##set($runtime = $cycle.get("runtime"))#*
        *##set($cavity = $cycle.get("cavity"))#*
        *##set($stdcycletime = $cycle.get("stdcycletime"))#*
        *##set($target = $math.div($runtime, $stdcycletime))#*
        *##set($target = $math.floor($target))#*
        *##set($target = $math.mul($targetquantity, $cavity))#*
        *##foreach($reject in $rejection)#*
          *##if($planid == $reject.get("_id").planid && $partname == $reject.get("_id").partname && $year == $reject.get("_id").year && $month == $reject.get("_id").month && $day == $reject.get("_id").day && $hour == $reject.get("_id").hour)#*
            *##set($rejected = $reject.get("rejectedquantity"))#*
          *##end#*
        *##end#*
        *##set($accepted = $math.sub($produced, $rejected))#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"hour": $displayHour,#*
          *#"planid": $planid,#*
          *#"machinename": $machinename,#*
          *#"partname": $partname,#*
          *#"target": $target,#*
          *#"produced": $produced,#*
          *#"accepted": $accepted,#*
          *#"rejected": $rejected#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwisemachineproduction',
    reportDescription: 'Shift Wise Machine Production',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'rework',
        reportObjectDesc: 'rework',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'scrap',
        reportObjectDesc: 'scrap',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwisemachineproduction" Description="Shift Wise Machine Production" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shift" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /><GroupField Name="runtime" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="stdcycletime" Field="sctm" GroupFunction="First" /><GroupField Name="cavity" Field="cavity" GroupFunction="First" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject><DataObject Name="rework" Collection="rework"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;rework&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="reworkquantity" Field="reworkquantity" GroupFunction="Sum" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject><DataObject Name="scrap" Collection="scrap"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;scrap&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="scrapweight" Field="scrapweight" GroupFunction="Sum" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shiftwise Machine Production",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "shift", "type": "String", "description": "Shift"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "planid", "type": "String", "description": "Plan"},#*
        *#{"name": "partname", "type": "String", "description": "Part"},#*
        *#{"name": "target", "type": "Long", "description": "Target"},#*
        *#{"name": "produced", "type": "Long", "description": "Produced"},#*
        *#{"name": "accepted", "type": "Long", "description": "Accepted"},#*
        *#{"name": "rejected", "type": "Long", "description": "Rejected"},#*
        *#{"name": "rework", "type": "Long", "description": "Rework"},#*
        *#{"name": "scrap", "type": "Long", "description": "Scrap (kg)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($rework = $resultmap.rework)#*
        *##set($scrap = $resultmap.scrap)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##foreach($cycle in $cycletime)#*
        *##set($planid = '"-"')#*
        *##set($machinename = '"-"')#*
        *##set($equipmentname = '"-"')#*
        *##set($partname = '"-"')#*
        *##set($moldname = '"-"')#*
        *##set($toolname = '"-"')#*
        *##set($trial = false)#*
        *##set($cavity = 1)#*
        *##set($runtime = 0)#*
        *##set($stdcycletime = 0)#*
        *##set($target = 0)#*
        *##set($produced = 0)#*
        *##set($accepted = 0)#*
        *##set($rejected = 0)#*
        *##set($reworkqty = 0)#*
        *##set($scrapweight = 0)#*
        *##set($year = $cycle.get("_id").year)#*
        *##set($month = $cycle.get("_id").month)#*
        *##set($day = $cycle.get("_id").day)#*
        *##set($shift = $cycle.get("_id").shift)#*
        *##set($planid = $cycle.get("_id").planid)#*
        *##set($partname = $cycle.get("_id").partname)#*
        *##set($machinename = $cycle.get("_id").machinename)#*
        *##set($produced = $cycle.get("actualquantity"))#*
        *##set($runtime = $cycle.get("runtime"))#*
        *##set($cavity = $cycle.get("cavity"))#*
        *##set($stdcycletime = $cycle.get("stdcycletime"))#*
        *##set($target = $math.div($runtime, $stdcycletime))#*
        *##set($target = $math.floor($target))#*
        *##set($target = $math.mul($targetquantity, $cavity))#*
        *##foreach($reject in $rejection)#*
          *##if($planid == $reject.get("_id").planid && $partname == $reject.get("_id").partname && $year == $reject.get("_id").year && $month == $reject.get("_id").month && $day == $reject.get("_id").day && $shift == $reject.get("_id").shift)#*
            *##set($rejected = $reject.get("rejectedquantity"))#*
          *##end#*
        *##end#*
        *##foreach($rw in $rework)#*
          *##if($planid == $rw.get("_id").planid && $partname == $rw.get("_id").partname && $year == $rw.get("_id").year && $month == $rw.get("_id").month && $day == $rw.get("_id").day && $shift == $rw.get("_id").shift)#*
            *##set($reworkqty = $rw.get("reworkquantity"))#*
          *##end#*
        *##end#*
        *##foreach($sc in $scrap)#*
          *##if($planid == $sc.get("_id").planid && $partname == $sc.get("_id").partname && $year == $sc.get("_id").year && $month == $sc.get("_id").month && $day == $sc.get("_id").day && $shift == $sc.get("_id").shift)#*
            *##set($scrapweight = $sc.get("scrapweight"))#*
          *##end#*
        *##end#*
        *##set($scrapweight = $math.roundTo(2, $scrapweight))#*
        *##set($accepted = $math.sub($produced, $rejected))#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"shift": $shift,#*
          *#"planid": $planid,#*
          *#"machinename": $machinename,#*
          *#"partname": $partname,#*
          *#"target": $target,#*
          *#"produced": $produced,#*
          *#"accepted": $accepted,#*
          *#"rejected": $rejected,#*
          *#"rework": $reworkqty,#*
          *#"scrap": $scrapweight#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'DAILY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'dailymachineproduction',
    reportDescription: 'Daily Machine Production',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'rework',
        reportObjectDesc: 'rework',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'scrap',
        reportObjectDesc: 'scrap',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="dailymachineproduction" Description="Shift Wise Machine Production" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /><GroupField Name="runtime" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="stdcycletime" Field="sctm" GroupFunction="First" /><GroupField Name="cavity" Field="cavity" GroupFunction="First" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject><DataObject Name="rework" Collection="rework"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;rework&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="reworkquantity" Field="reworkquantity" GroupFunction="Sum" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject><DataObject Name="scrap" Collection="scrap"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;scrap&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="scrapweight" Field="scrapweight" GroupFunction="Sum" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Daily Machine Production",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "planid", "type": "String", "description": "Plan"},#*
        *#{"name": "partname", "type": "String", "description": "Part"},#*
        *#{"name": "target", "type": "Long", "description": "Target"},#*
        *#{"name": "produced", "type": "Long", "description": "Produced"},#*
        *#{"name": "accepted", "type": "Long", "description": "Accepted"},#*
        *#{"name": "rejected", "type": "Long", "description": "Rejected"},#*
        *#{"name": "rework", "type": "Long", "description": "Rework"},#*
        *#{"name": "scrap", "type": "Long", "description": "Scrap (kg)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($rework = $resultmap.rework)#*
        *##set($scrap = $resultmap.scrap)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##foreach($cycle in $cycletime)#*
        *##set($planid = '"-"')#*
        *##set($machinename = '"-"')#*
        *##set($equipmentname = '"-"')#*
        *##set($partname = '"-"')#*
        *##set($moldname = '"-"')#*
        *##set($toolname = '"-"')#*
        *##set($trial = false)#*
        *##set($cavity = 1)#*
        *##set($runtime = 0)#*
        *##set($stdcycletime = 0)#*
        *##set($target = 0)#*
        *##set($produced = 0)#*
        *##set($accepted = 0)#*
        *##set($rejected = 0)#*
        *##set($reworkqty = 0)#*
        *##set($scrapweight = 0)#*
        *##set($year = $cycle.get("_id").year)#*
        *##set($month = $cycle.get("_id").month)#*
        *##set($day = $cycle.get("_id").day)#*
        *##set($planid = $cycle.get("_id").planid)#*
        *##set($partname = $cycle.get("_id").partname)#*
        *##set($machinename = $cycle.get("_id").machinename)#*
        *##set($produced = $cycle.get("actualquantity"))#*
        *##set($runtime = $cycle.get("runtime"))#*
        *##set($cavity = $cycle.get("cavity"))#*
        *##set($stdcycletime = $cycle.get("stdcycletime"))#*
        *##set($target = $math.div($runtime, $stdcycletime))#*
        *##set($target = $math.floor($target))#*
        *##set($target = $math.mul($targetquantity, $cavity))#*
        *##foreach($reject in $rejection)#*
          *##if($planid == $reject.get("_id").planid && $partname == $reject.get("_id").partname && $year == $reject.get("_id").year && $month == $reject.get("_id").month && $day == $reject.get("_id").day)#*
            *##set($rejected = $reject.get("rejectedquantity"))#*
          *##end#*
        *##end#*
        *##foreach($rw in $rework)#*
          *##if($planid == $rw.get("_id").planid && $partname == $rw.get("_id").partname && $year == $rw.get("_id").year && $month == $rw.get("_id").month && $day == $rw.get("_id").day)#*
            *##set($reworkqty = $rw.get("reworkquantity"))#*
          *##end#*
        *##end#*
        *##foreach($sc in $scrap)#*
          *##if($planid == $sc.get("_id").planid && $partname == $sc.get("_id").partname && $year == $sc.get("_id").year && $month == $sc.get("_id").month && $day == $sc.get("_id").day)#*
            *##set($scrapweight = $sc.get("scrapweight"))#*
          *##end#*
        *##end#*
        *##set($scrapweight = $math.roundTo(2, $scrapweight))#*
        *##set($accepted = $math.sub($produced, $rejected))#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"planid": $planid,#*
          *#"machinename": $machinename,#*
          *#"partname": $partname,#*
          *#"target": $target,#*
          *#"produced": $produced,#*
          *#"accepted": $accepted,#*
          *#"rejected": $rejected,#*
          *#"rework": $reworkqty,#*
          *#"scrap": $scrapweight#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlymachinedowntime',
    reportDescription: 'Hourly Machine Downtime',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlymachinedowntime" Description="Hourly Machine Downtime" Database="emgda" Host="localhost" Port="27017"><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;complete&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="downtimereason" Field="reasonname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Hourly Machine Downtime",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "hour", "type": "String", "description": "Hour"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "downtimereason", "type": "String", "description": "Downtime reason"},#*
        *#{"name": "totaldowntime", "type": "String", "description": "Total downtime (hh:mm:ss)"},#*
        *#{"name": "totaldowntimeinmins", "type": "Integer", "description": "Total downtime (mins)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($downtime = $resultmap.downtime)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($down in $downtime)#*
        *##set($hour = '"-"')#*
        *##set($downtimereason = '"No reason"')#*
        *##set($year = $down.get("_id").year)#*
        *##set($month = $down.get("_id").month)#*
        *##set($day = $down.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($hour = $down.get("_id").displayHour)#*
        *##set($machinename = $down.get("_id").machinename)#*
        *##set($downtimereason = $down.get("_id").downtimereason)#*
        *##set($totaldowntimeinms = $down.get("totaldowntime"))#*
        *##set($totaldowntimeinsec = $math.div($totaldowntimeinms, 1000))#*
        *##set($totaldowntimeinmins = $math.div($totaldowntimeinsec, 60))#*
        *##set($totaldowntimeinmins = $math.roundTo(2, $totaldowntimeinmins))#*
        *##set($h = $math.div($totaldowntimeinsec, 3600))#*
        *##set($h = $math.floor($h))#*
        *##set($m = $math.mod($totaldowntimeinsec, 3600))#*
        *##set($m = $math.div($m, 60))#*
        *##set($m = $math.floor($m))#*
        *##set($s = $math.mod($totaldowntimeinsec, 3600))#*
        *##set($s = $math.mod($s, 60))#*
        *##set($s = $math.floor($s))#*
        *##set($totaldowntime = $quot+$h+$sep+$m+$sep+$s+$quot)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"hour": $hour,#*
          *#"machinename": $machinename,#*
          *#"downtimereason": $downtimereason,#*
          *#"totaldowntime": $totaldowntime,#*
          *#"totaldowntimeinmins": $totaldowntimeinmins#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwisemachinedowntime',
    reportDescription: 'Shift Wise Machine Downtime',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwisemachinedowntime" Description="Shift Wise Machine Downtime" Database="emgda" Host="localhost" Port="27017"><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;complete&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="downtimereason" Field="reasonname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shiftwise Machine Downtime",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name":"shift","type":"String","description":"Shift"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "downtimereason", "type": "String", "description": "Downtime reason"},#*
        *#{"name": "totaldowntime", "type": "String", "description": "Total downtime (hh:mm:ss)"},#*
        *#{"name": "totaldowntimeinmins", "type": "Integer", "description": "Total downtime (mins)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($downtime = $resultmap.downtime)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($down in $downtime)#*
        *##set($downtimereason = '"No reason"')#*
        *##set($year = $down.get("_id").year)#*
        *##set($month = $down.get("_id").month)#*
        *##set($day = $down.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($shift = $down.get("_id").shift)#*
        *##set($machinename = $down.get("_id").machinename)#*
        *##set($downtimereason = $down.get("_id").downtimereason)#*
        *##set($totaldowntimeinms = $down.get("totaldowntime"))#*
        *##set($totaldowntimeinsec = $math.div($totaldowntimeinms, 1000))#*
        *##set($totaldowntimeinmins = $math.div($totaldowntimeinsec, 60))#*
        *##set($totaldowntimeinmins = $math.roundTo(2, $totaldowntimeinmins))#*
        *##set($h = $math.div($totaldowntimeinsec, 3600))#*
        *##set($h = $math.floor($h))#*
        *##set($m = $math.mod($totaldowntimeinsec, 3600))#*
        *##set($m = $math.div($m, 60))#*
        *##set($m = $math.floor($m))#*
        *##set($s = $math.mod($totaldowntimeinsec, 3600))#*
        *##set($s = $math.mod($s, 60))#*
        *##set($s = $math.floor($s))#*
        *##set($totaldowntime = $quot+$h+$sep+$m+$sep+$s+$quot)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"shift": $shift,#*
          *#"machinename": $machinename,#*
          *#"downtimereason": $downtimereason,#*
          *#"totaldowntime": $totaldowntime,#*
          *#"totaldowntimeinmins": $totaldowntimeinmins#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'DAILY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'dailymachinedowntime',
    reportDescription: 'Daily Machine Downtime',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="dailymachinedowntime" Description="Daily Machine Downtime" Database="emgda" Host="localhost" Port="27017"><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;complete&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="downtimereason" Field="reasonname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Daily Machine Downtime",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "downtimereason", "type": "String", "description": "Downtime reason"},#*
        *#{"name": "totaldowntime", "type": "String", "description": "Total downtime (hh:mm:ss)"},#*
        *#{"name": "totaldowntimeinmins", "type": "Integer", "description": "Total downtime (mins)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($downtime = $resultmap.downtime)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($down in $downtime)#*
        *##set($downtimereason = '"No reason"')#*
        *##set($year = $down.get("_id").year)#*
        *##set($month = $down.get("_id").month)#*
        *##set($day = $down.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($machinename = $down.get("_id").machinename)#*
        *##set($downtimereason = $down.get("_id").downtimereason)#*
        *##set($totaldowntimeinms = $down.get("totaldowntime"))#*
        *##set($totaldowntimeinsec = $math.div($totaldowntimeinms, 1000))#*
        *##set($totaldowntimeinmins = $math.div($totaldowntimeinsec, 60))#*
        *##set($totaldowntimeinmins = $math.roundTo(2, $totaldowntimeinmins))#*
        *##set($h = $math.div($totaldowntimeinsec, 3600))#*
        *##set($h = $math.floor($h))#*
        *##set($m = $math.mod($totaldowntimeinsec, 3600))#*
        *##set($m = $math.div($m, 60))#*
        *##set($m = $math.floor($m))#*
        *##set($s = $math.mod($totaldowntimeinsec, 3600))#*
        *##set($s = $math.mod($s, 60))#*
        *##set($s = $math.floor($s))#*
        *##set($totaldowntime = $quot+$h+$sep+$m+$sep+$s+$quot)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"machinename": $machinename,#*
          *#"downtimereason": $downtimereason,#*
          *#"totaldowntime": $totaldowntime,#*
          *#"totaldowntimeinmins": $totaldowntimeinmins#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlyrejectionbyreason',
    reportDescription: 'Hourly Rejection By Reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlyrejectionbyreason" Description="Hourly Rejection By Reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="remark" Field="remark" /><Key Name="code" Field="reasoncode" /><Key Name="reason" Field="reasonname" /><Key Name="department" Field="department" /><Key Name="category" Field="category" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Hourly Rejection By Reason",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "hour", "type": "String", "description": "Hour"},#*
        *#{"name": "department", "type": "String", "description": "Department"},#*
        *#{"name": "category", "type": "String", "description": "Category"},#*
        *#{"name": "code", "type": "String", "description": "Code"},#*
        *#{"name": "reason", "type": "String", "description": "Reason"},#*
        *#{"name": "remark", "type": "String", "description": "Remark"},#*
        *#{"name": "rejected", "type": "Integer", "description": "Rejected"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($rej in $rejection)#*
        *##set($hour = '"-"')#*
        *##set($remark = '"-"')#*
        *##set($year = $rej.get("_id").year)#*
        *##set($month = $rej.get("_id").month)#*
        *##set($day = $rej.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($hour = $rej.get("_id").displayHour)#*
        *##set($department = $rej.get("_id").department)#*
        *##set($category = $rej.get("_id").category)#*
        *##set($code = $rej.get("_id").code)#*
        *##set($reason = $rej.get("_id").reason)#*
        *##set($remark = $rej.get("_id").remark)#*
        *##set($rejected = $rej.get("rejectedquantity"))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"hour": $hour,#*
          *#"department": $department,#*
          *#"category": $category,#*
          *#"code": $code,#*
          *#"reason": $reason,#*
          *#"remark": $remark,#*
          *#"rejected": $rejected#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwiserejectionbyreason',
    reportDescription: 'Shiftwise Rejection By Reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwiserejectionbyreason" Description="Shiftwise Rejection By Reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="remark" Field="remark" /><Key Name="code" Field="reasoncode" /><Key Name="reason" Field="reasonname" /><Key Name="department" Field="department" /><Key Name="category" Field="category" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shiftwise Rejection By Reason",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "shift", "type": "String", "description": "Shift"},#*
        *#{"name": "department", "type": "String", "description": "Department"},#*
        *#{"name": "category", "type": "String", "description": "Category"},#*
        *#{"name": "code", "type": "String", "description": "Code"},#*
        *#{"name": "reason", "type": "String", "description": "Reason"},#*
        *#{"name": "remark", "type": "String", "description": "Remark"},#*
        *#{"name": "rejected", "type": "Integer", "description": "Rejected"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($rej in $rejection)#*
        *##set($shift = '"-"')#*
        *##set($remark = '"-"')#*
        *##set($year = $rej.get("_id").year)#*
        *##set($month = $rej.get("_id").month)#*
        *##set($day = $rej.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($shift = $rej.get("_id").shift)#*
        *##set($department = $rej.get("_id").department)#*
        *##set($category = $rej.get("_id").category)#*
        *##set($code = $rej.get("_id").code)#*
        *##set($reason = $rej.get("_id").reason)#*
        *##set($remark = $rej.get("_id").remark)#*
        *##set($rejected = $rej.get("rejectedquantity"))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"shift": $shift,#*
          *#"department": $department,#*
          *#"category": $category,#*
          *#"code": $code,#*
          *#"reason": $reason,#*
          *#"remark": $remark,#*
          *#"rejected": $rejected#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'DAILY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'dailyrejectionbyreason',
    reportDescription: 'Daily Rejection By Reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="dailyrejectionbyreason" Description="Daily Rejection By Reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="remark" Field="remark" /><Key Name="code" Field="reasoncode" /><Key Name="reason" Field="reasonname" /><Key Name="department" Field="department" /><Key Name="category" Field="category" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Daily Rejection By Reason",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "department", "type": "String", "description": "Department"},#*
        *#{"name": "category", "type": "String", "description": "Category"},#*
        *#{"name": "code", "type": "String", "description": "Code"},#*
        *#{"name": "reason", "type": "String", "description": "Reason"},#*
        *#{"name": "remark", "type": "String", "description": "Remark"},#*
        *#{"name": "rejected", "type": "Integer", "description": "Rejected"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($rej in $rejection)#*
        *##set($remark = '"-"')#*
        *##set($year = $rej.get("_id").year)#*
        *##set($month = $rej.get("_id").month)#*
        *##set($day = $rej.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($department = $rej.get("_id").department)#*
        *##set($category = $rej.get("_id").category)#*
        *##set($code = $rej.get("_id").code)#*
        *##set($reason = $rej.get("_id").reason)#*
        *##set($remark = $rej.get("_id").remark)#*
        *##set($rejected = $rej.get("rejectedquantity"))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"department": $department,#*
          *#"category": $category,#*
          *#"code": $code,#*
          *#"reason": $reason,#*
          *#"remark": $remark,#*
          *#"rejected": $rejected#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwisereworkbyreason',
    reportDescription: 'Shiftwise Rework By Reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rework',
        reportObjectDesc: 'rework',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwisereworkbyreason" Description="Shiftwise Rework By Reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rework" Collection="rework"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rework&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="remark" Field="remark" /><Key Name="code" Field="reasoncode" /><Key Name="reason" Field="reasonname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="reworkquantity" Field="reworkquantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shiftwise Rework By Reason",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "shift", "type": "String", "description": "Shift"},#*
        *#{"name": "code", "type": "String", "description": "Code"},#*
        *#{"name": "reason", "type": "String", "description": "Reason"},#*
        *#{"name": "remark", "type": "String", "description": "Remark"},#*
        *#{"name": "reworkquantity", "type": "Integer", "description": "Rework quantity"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($rework = $resultmap.rework)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($rw in $rework)#*
        *##set($shift = '"-"')#*
        *##set($remark = '"-"')#*
        *##set($year = $rw.get("_id").year)#*
        *##set($month = $rw.get("_id").month)#*
        *##set($day = $rw.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($shift = $rw.get("_id").shift)#*
        *##set($code = $rw.get("_id").code)#*
        *##set($reason = $rw.get("_id").reason)#*
        *##set($remark = $rw.get("_id").remark)#*
        *##set($reworkquantity = $rw.get("reworkquantity"))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"shift": $shift,#*
          *#"code": $code,#*
          *#"reason": $reason,#*
          *#"remark": $remark,#*
          *#"reworkquantity": $reworkquantity#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'DAILY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'dailyreworkbyreason',
    reportDescription: 'Daily Rework By Reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rework',
        reportObjectDesc: 'rework',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="dailyreworkbyreason" Description="Daily Rework By Reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rework" Collection="rework"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rework&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="remark" Field="remark" /><Key Name="code" Field="reasoncode" /><Key Name="reason" Field="reasonname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="reworkquantity" Field="reworkquantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Daily Rework By Reason",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "code", "type": "String", "description": "Code"},#*
        *#{"name": "reason", "type": "String", "description": "Reason"},#*
        *#{"name": "remark", "type": "String", "description": "Remark"},#*
        *#{"name": "reworkquantity", "type": "Integer", "description": "Rework quantity"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($rework = $resultmap.rework)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($rw in $rework)#*
        *##set($remark = '"-"')#*
        *##set($year = $rw.get("_id").year)#*
        *##set($month = $rw.get("_id").month)#*
        *##set($day = $rw.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($code = $rw.get("_id").code)#*
        *##set($reason = $rw.get("_id").reason)#*
        *##set($remark = $rw.get("_id").remark)#*
        *##set($reworkquantity = $rw.get("reworkquantity"))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"code": $code,#*
          *#"reason": $reason,#*
          *#"remark": $remark,#*
          *#"reworkquantity": $reworkquantity#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwisescrapbyreason',
    reportDescription: 'Shiftwise Scrap By Reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'scrap',
        reportObjectDesc: 'scrap',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwisescrapbyreason" Description="Shiftwise Scrap By Reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="scrap" Collection="scrap"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;scrap&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="remark" Field="remark" /><Key Name="code" Field="reasoncode" /><Key Name="reason" Field="reasonname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="scrapweight" Field="scrapweight" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shiftwise Scrap By Reason",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "shift", "type": "String", "description": "Shift"},#*
        *#{"name": "code", "type": "String", "description": "Code"},#*
        *#{"name": "reason", "type": "String", "description": "Reason"},#*
        *#{"name": "remark", "type": "String", "description": "Remark"},#*
        *#{"name": "scrapweight", "type": "Integer", "description": "Scrap weight (kg)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($scrap = $resultmap.scrap)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($sc in $scrap)#*
        *##set($shift = '"-"')#*
        *##set($remark = '"-"')#*
        *##set($year = $sc.get("_id").year)#*
        *##set($month = $sc.get("_id").month)#*
        *##set($day = $sc.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($shift = $sc.get("_id").shift)#*
        *##set($code = $sc.get("_id").code)#*
        *##set($reason = $sc.get("_id").reason)#*
        *##set($remark = $sc.get("_id").remark)#*
        *##set($scrapweight = $sc.get("scrapweight"))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"shift": $shift,#*
          *#"code": $code,#*
          *#"reason": $reason,#*
          *#"remark": $remark,#*
          *#"scrapweight": $scrapweight#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'DAILY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'dailyscrapbyreason',
    reportDescription: 'Daily Scrap By Reason',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'scrap',
        reportObjectDesc: 'scrap',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="dailyscrapbyreason" Description="Daily Scrap By Reason" Database="emgda" Host="localhost" Port="27017"><DataObject Name="scrap" Collection="scrap"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;scrap&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="remark" Field="remark" /><Key Name="code" Field="reasoncode" /><Key Name="reason" Field="reasonname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="scrapweight" Field="scrapweight" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Daily Scrap By Reason",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "code", "type": "String", "description": "Code"},#*
        *#{"name": "reason", "type": "String", "description": "Reason"},#*
        *#{"name": "remark", "type": "String", "description": "Remark"},#*
        *#{"name": "scrapweight", "type": "Integer", "description": "Scrap weight (kg)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($scrap = $resultmap.scrap)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($sc in $scrap)#*
        *##set($remark = '"-"')#*
        *##set($year = $sc.get("_id").year)#*
        *##set($month = $sc.get("_id").month)#*
        *##set($day = $sc.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($code = $sc.get("_id").code)#*
        *##set($reason = $sc.get("_id").reason)#*
        *##set($remark = $sc.get("_id").remark)#*
        *##set($scrapweight = $sc.get("scrapweight"))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"code": $code,#*
          *#"reason": $reason,#*
          *#"remark": $remark,#*
          *#"scrapweight": $scrapweight#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlymachineperformance',
    reportDescription: 'Hourly Machine Performance',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlymachineperformance" Description="Hourly Machine Performance" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="machinewise-oee-hourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><Key Name="availability" Field="availability" /><Key Name="performance" Field="performance" /><Key Name="quality" Field="quality" /><Key Name="oee" Field="oee" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name": "Hourly Machine Performance",#*
      *#"aggFunc" : "avg",#*
      *##set($count = 0)#*
      *#"cols": [#*
            *#{"name":"date","type":"String","description":"Date"},#*
            *#{"name": "hour", "type": "String", "description": "Hour"},#*
            *#{"name": "machinename", "type": "String", "description": "Machine name"},#*
            *#{"name": "availability", "type": "Integer", "description": "Availablity"},#*
            *#{"name": "performance", "type": "Integer", "description": "Performance"},#*
            *#{"name": "quality", "type": "Integer", "description": "Quality"},#*
            *#{"name": "oee", "type": "Integer", "description": "OEE"}#*
      *#],#*
      *#"reportData": [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($cycle in $cycletime)#*
        *##set($hour = '"-"')#*
        *##set($availability = 0)#*
        *##set($performance = 0)#*
        *##set($quality = 0)#*
        *##set($oee = 0)#*
        *##set($year = $cycle.get("_id").year)#*
        *##set($month = $cycle.get("_id").month)#*
        *##set($day = $cycle.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($hour = $cycle.get("_id").displayHour)#*
        *##set($machinename = $cycle.get("_id").machinename)#*
        *##set($availability = $cycle.get("_id").availability)#*
        *##set($performance = $cycle.get("_id").performance)#*
        *##set($quality = $cycle.get("_id").quality)#*
        *##set($oee = $cycle.get("_id").oee)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"hour": $hour,#*
          *#"machinename": $machinename,#*
          *#"availability": $availability,#*
          *#"performance": $performance,#*
          *#"quality": $quality,#*
          *#"oee": $oee#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records": $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlyanalysis',
    reportDescription: 'Hourly Analysis',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlyanalysis" Description="Hourly Analysis" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /><GroupField Name="runtime" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="standardtime" Field="sctm_sum" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; status == &quot;complete&quot; &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Hourly Analysis",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date", "description_cn":"日期"},#*
        *#{"name": "hour", "type": "String", "description": "Hour"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "planid", "type": "String", "description": "Plan"},#*
        *#{"name": "partname", "type": "String", "description": "Part"},#*
        *#{"name": "produced", "type": "Long", "description": "Produced"},#*
        *#{"name": "rejectionpercent", "type": "Long", "description": "Rejection(%)"},#*
        *#{"name": "runtime", "type": "Long", "description": "Runtime(mins)"},#*
        *#{"name": "delaytime", "type": "Long", "description": "Delay time(mins)"},#*
        *#{"name": "totaldowntime", "type": "Long", "description": "Downtime(mins)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($downtime = $resultmap.downtime)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##foreach($cycle in $cycletime)#*
          *##set($planid = '"-"')#*
          *##set($machinename = '"-"')#*
          *##set($partname = '"-"')#*
          *##set($runtime = 0)#*
          *##set($delaytime = 0)#*
          *##set($totaldowntime = 0)#*
          *##set($standardtime = 0)#*
          *##set($rejected = 0)#*
          *##set($rejectionpercent = 0)#*
          *##set($year = $cycle.get("_id").year)#*
          *##set($month = $cycle.get("_id").month)#*
          *##set($day = $cycle.get("_id").day)#*
          *##set($hour = $cycle.get("_id").hour)#*
          *##set($displayHour = $cycle.get("_id").displayHour)#*
          *##set($planid = $cycle.get("_id").planid)#*
          *##set($partname = $cycle.get("_id").partname)#*
          *##set($machinename = $cycle.get("_id").machinename)#*
          *##set($produced = $cycle.get("actualquantity"))#*
          *##set($runtime = $cycle.get("runtime"))#*
          *##set($standardtime = $cycle.get("standardtime"))#*
          *##set($delaytime = $math.sub($runtime, $standardtime))#*
          *##if($delaytime < 0)#* 
            *##set($delaytime = 0)#*
          *##end#*
          *##foreach($reject in $rejection)#*
            *##if($planid == $reject.get("_id").planid && $partname == $reject.get("_id").partname && $year == $reject.get("_id").year && $month == $reject.get("_id").month && $day == $reject.get("_id").day && $hour == $reject.get("_id").hour)#*
              *##set($rejected = $reject.get("rejectedquantity"))#*
            *##end#*
          *##end#*
          *##foreach($dt in $downtime)#*
            *##if($planid == $dt.get("_id").planid && $partname == $dt.get("_id").partname && $year == $dt.get("_id").year && $month == $dt.get("_id").month && $day == $dt.get("_id").day && $hour == $dt.get("_id").hour)#*
              *##set($totaldowntime = $dt.get("totaldowntime"))#*
            *##end#*
          *##end#*
          *##set($rejectionpercent = $math.div($rejected, $produced))#*
          *##set($rejectionpercent = $math.mul($rejectionpercent, 100))#*
          *##set($rejectionpercent = $math.roundTo(2, $rejectionpercent))#*
          *##set($delaytime = $math.div($delaytime, 1000))#*
          *##set($delaytime = $math.div($delaytime, 60))#*
          *##set($delaytime = $math.roundTo(2, $delaytime))#*
          *##set($runtime = $math.div($runtime, 1000))#*
          *##set($runtime = $math.div($runtime, 60))#*
          *##set($runtime = $math.roundTo(2, $runtime))#*
          *##set($totaldowntime = $math.div($totaldowntime, 1000))#*
          *##set($totaldowntime = $math.div($totaldowntime, 60))#*
          *##set($totaldowntime = $math.roundTo(2, $totaldowntime))#*
          *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#{#*
            *#"date": $date,#*
            *#"hour": $displayHour,#*
            *#"machinename": $machinename,#*
            *#"planid": $planid,#*
            *#"partname": $partname,#*
            *#"produced": $produced,#*
            *#"rejectionpercent": $rejectionpercent,#*
            *#"runtime": $runtime,#*
            *#"delaytime": $delaytime,#*
            *#"totaldowntime": $totaldowntime#*
          *#}#*
          *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwisemachineperformance',
    reportDescription: 'Shiftwise Machine Performance',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwisemachineperformance" Description="Shiftwise Machine Performance" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="machinewise-oee-shift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shift" /><Key Name="availability" Field="availability" /><Key Name="performance" Field="performance" /><Key Name="quality" Field="quality" /><Key Name="oee" Field="oee" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name": "Shift wise Machine Performance",#*
      *#"aggFunc" : "avg",#*
      *##set($count = 0)#*
      *#"cols": [#*
            *#{"name":"date","type":"String","description":"Date"},#*
            *#{"name": "shift", "type": "String", "description": "Shift"},#*
            *#{"name": "machinename", "type": "String", "description": "Machine name"},#*
            *#{"name": "availability", "type": "Integer", "description": "Availablity"},#*
            *#{"name": "performance", "type": "Integer", "description": "Performance"},#*
            *#{"name": "quality", "type": "Integer", "description": "Quality"},#*
            *#{"name": "oee", "type": "Integer", "description": "OEE"}#*
      *#],#*
      *#"reportData": [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($cycle in $cycletime)#*
        *##set($shift = '"-"')#*
        *##set($availability = 0)#*
        *##set($performance = 0)#*
        *##set($quality = 0)#*
        *##set($oee = 0)#*
        *##set($year = $cycle.get("_id").year)#*
        *##set($month = $cycle.get("_id").month)#*
        *##set($day = $cycle.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($shift = $cycle.get("_id").shift)#*
        *##set($machinename = $cycle.get("_id").machinename)#*
        *##set($availability = $cycle.get("_id").availability)#*
        *##set($performance = $cycle.get("_id").performance)#*
        *##set($quality = $cycle.get("_id").quality)#*
        *##set($oee = $cycle.get("_id").oee)#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"shift": $shift,#*
          *#"machinename": $machinename,#*
          *#"availability": $availability,#*
          *#"performance": $performance,#*
          *#"quality": $quality,#*
          *#"oee": $oee#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records": $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwiseoperatorefficiency',
    reportDescription: 'Shift Wise Operator Efficiency',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
      {
        reportObjectname: 'operatorlog',
        reportObjectDesc: 'operatorlog',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwiseoperatorefficiency" Description="Shift Wise Operator Efficiency" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shift" /><GroupField Name="actualquantity" Field="qty" GroupFunction="Sum" /><GroupField Name="runtime" Field="actm_sum" GroupFunction="Sum" /><GroupField Name="standardtime" Field="sctm_sum" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;rejection&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="planid" Field="planid" /><Key Name="partname" Field="partname" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /><GroupField Name="rejectedquantity" Field="quantity" GroupFunction="Sum" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject><DataObject Name="operatorlog" Collection="operatorlog"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp;  elementName == &quot;operatorlog&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="operatorname" Field="operatorname" /><Key Name="operatorcode" Field="operatorcode" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shiftName" /></Group></Pipeline></Aggregate><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shiftwise Operator Efficiency",#*
      *#"aggFunc" : "sum",#*
      *##set($count = 0)#*
      *#"cols": [#*
        *#{"name":"date","type":"String","description":"Date"},#*
        *#{"name": "shift", "type": "String", "description": "Shift"},#*
        *#{"name": "machinename", "type": "String", "description": "Machine"},#*
        *#{"name": "operatorname", "type": "String", "description": "Operator"},#*
        *#{"name": "operatorcode", "type": "String", "description": "Operator code"},#*
        *#{"name": "planid", "type": "String", "description": "Plan"},#*
        *#{"name": "partname", "type": "String", "description": "Part"},#*
        *#{"name": "rejectionpercent", "type": "Long", "description": "Rejection(%)"},#*
        *#{"name": "efficiency", "type": "Long", "description": "Operator Efficiency(%)"},#*
        *#{"name": "delaytime", "type": "Long", "description": "Operator delay(mins)"},#*
        *#{"name": "runtime", "type": "Long", "description": "Runtime(mins)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($rejection = $resultmap.rejection)#*
        *##set($operatorlog = $resultmap.operatorlog)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##foreach($cycle in $cycletime)#*
          *##set($planid = '"-"')#*
          *##set($machinename = '"-"')#*
          *##set($partname = '"-"')#*
          *##set($runtime = 0)#*
          *##set($standardtime = 0)#*
          *##set($operatorname = '"-"')#*
          *##set($operatorcode = '"-"')#*
          *##set($produced = 0)#*
          *##set($rejected = 0)#*
          *##set($rejectionpercent = 0)#*
          *##set($efficiency = 0)#*
          *##set($delaytime = 0)#*
          *##set($year = $cycle.get("_id").year)#*
          *##set($month = $cycle.get("_id").month)#*
          *##set($day = $cycle.get("_id").day)#*
          *##set($shift = $cycle.get("_id").shift)#*
          *##set($planid = $cycle.get("_id").planid)#*
          *##set($partname = $cycle.get("_id").partname)#*
          *##set($machinename = $cycle.get("_id").machinename)#*
          *##set($produced = $cycle.get("actualquantity"))#*
          *##set($runtime = $cycle.get("runtime"))#*
          *##set($standardtime = $cycle.get("standardtime"))#*
          *##set($delaytime = $math.sub($runtime, $standardtime))#*
          *##if($delaytime < 0)#* 
            *##set($delaytime = 0)#*
          *##end#*
          *##set($efficiency = $math.sub($runtime, $delaytime))#*
          *##set($efficiency = $math.div($efficiency, $runtime))#*
          *##set($efficiency = $math.mul($efficiency, 100))#*
          *##set($efficiency = $math.roundTo(2, $efficiency))#*
          *##foreach($reject in $rejection)#*
            *##if($planid == $reject.get("_id").planid && $partname == $reject.get("_id").partname && $year == $reject.get("_id").year && $month == $reject.get("_id").month && $day == $reject.get("_id").day && $shift == $reject.get("_id").shift)#*
              *##set($rejected = $reject.get("rejectedquantity"))#*
            *##end#*
          *##end#*
          *##foreach($op in $operatorlog)#*
            *##if($machinename == $op.get("_id").machinename && $year == $op.get("_id").year && $month == $op.get("_id").month && $day == $op.get("_id").day && $shift == $op.get("_id").shift)#*
              *##set($operatorname = $op.get("_id").operatorname)#*
              *##set($operatorcode = $op.get("_id").operatorcode)#*
            *##end#*
          *##end#*
          *##set($rejectionpercent = $math.div($rejected, $produced))#*
          *##set($rejectionpercent = $math.mul($rejectionpercent, 100))#*
          *##set($rejectionpercent = $math.roundTo(2, $rejectionpercent))#*
          *##set($delaytime = $math.div($delaytime, 1000))#*
          *##set($delaytime = $math.div($delaytime, 60))#*
          *##set($delaytime = $math.roundTo(2, $delaytime))#*
          *##set($runtime = $math.div($runtime, 1000))#*
          *##set($runtime = $math.div($runtime, 60))#*
          *##set($runtime = $math.roundTo(2, $runtime))#*
          *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#{#*
            *#"date": $date,#*
            *#"shift": $shift,#*
            *#"machinename": $machinename,#*
            *#"operatorname": $operatorname,#*
            *#"operatorcode": $operatorcode,#*
            *#"planid": $planid,#*
            *#"partname": $partname,#*
            *#"rejectionpercent": $rejectionpercent,#*
            *#"efficiency": $efficiency,#*
            *#"delaytime": $delaytime,#*
            *#"runtime": $runtime#*
          *#}#*
          *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records" : $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'DAILY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'dailymachineperformance',
    reportDescription: 'Daily Machine Performance',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="dailymachineperformance" Description="Daily Machine Performance" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="machinewise-oee-hourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; date &gt;= start &amp;&amp; date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><GroupField Name="runtime" Field="runtime" GroupFunction="Sum" /><GroupField Name="plannedProductionTime" Field="hourlyAvailableTime" GroupFunction="Sum" /><GroupField Name="target" Field="target" GroupFunction="Sum" /><GroupField Name="produced" Field="produced" GroupFunction="Sum" /><GroupField Name="rejected" Field="rejected" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name": "Daily Machine Performance",#*
      *#"aggFunc" : "avg",#*
      *##set($count = 0)#*
      *#"cols": [#*
            *#{"name":"date","type":"String","description":"Date"},#*
            *#{"name": "machinename", "type": "String", "description": "Machine name"},#*
            *#{"name": "availability", "type": "Integer", "description": "Availablity"},#*
            *#{"name": "performance", "type": "Integer", "description": "Performance"},#*
            *#{"name": "quality", "type": "Integer", "description": "Quality"},#*
            *#{"name": "oee", "type": "Integer", "description": "OEE"}#*
      *#],#*
      *#"reportData": [#*
        *##set($cycletime = $resultmap.cycletime)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##set($sep = ':')#*
        *##foreach($cycle in $cycletime)#*
        *##set($runtime = 0)#*
        *##set($plannedProductionTime = 0)#*
        *##set($target = 0)#*
        *##set($produced = 0)#*
        *##set($rejected = 0)#*
        *##set($accepted = 0)#*
        *##set($availability = 0)#*
        *##set($performance = 0)#*
        *##set($quality = 0)#*
        *##set($oee = 0)#*
        *##set($year = $cycle.get("_id").year)#*
        *##set($month = $cycle.get("_id").month)#*
        *##set($day = $cycle.get("_id").day)#*
        *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
        *##set($machinename = $cycle.get("_id").machinename)#*
        *##set($runtime = $cycle.get("runtime"))#*
        *##set($plannedProductionTime = $cycle.get("plannedProductionTime"))#*
        *##set($target = $cycle.get("target"))#*
        *##set($produced = $cycle.get("produced"))#*
        *##set($rejected = $cycle.get("rejected"))#*
        *##set($accepted = $math.sub($produced, $rejected))#*
        *##set($availability = $math.div($runtime, $plannedProductionTime))#*
        *##set($performance = $math.div($produced, $target))#*
        *##set($quality = $math.div($accepted, $produced))#*
        *##set($oee = $math.mul($availability, $performance))#*
        *##set($oee = $math.mul($oee, $quality))#*
        *##set($oee = $math.mul($oee, 100))#*
        *##set($oee = $math.roundTo(2, $oee))#*
        *##set($availability = $math.mul($availability, 100))#*
        *##set($availability = $math.roundTo(2, $availability))#*
        *##set($performance = $math.mul($performance, 100))#*
        *##set($performance = $math.roundTo(2, $performance))#*
        *##set($quality = $math.mul($quality, 100))#*
        *##set($quality = $math.roundTo(2, $quality))#*
        *##if($count > 0)#* 
          *#,#* 
        *##end#*
        *#{#*
          *#"date": $date,#*
          *#"machinename": $machinename,#*
          *#"availability": $availability,#*
          *#"performance": $performance,#*
          *#"quality": $quality,#*
          *#"oee": $oee#*
        *#}#*
        *##set($count=$count+1)#*
        *##end#*
      *#],#*
      *#"records": $count#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'HOURLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'hourlyenergyconsumption',
    reportDescription: 'Hourly Energy Consumption',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'energy',
        reportObjectDesc: 'energy',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="hourlyenergyconsumption" Description="Hourly Energy Consumption" Database="emgda" Host="localhost" Port="27017"><DataObject Name="energy" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;utility&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="metername" Field="metername" /><Key Name="metergroup" Field="metergroup" /><Key Name="metersubgroup" Field="metersubgroup" /><Key Name="metersubsubgroup" Field="metersubsubgroup" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="hour" Field="hour" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="kvah" Field="kvah_sum" GroupFunction="Sum" /><GroupField Name="kwh" Field="kwh_sum" GroupFunction="Sum" /><GroupField Name="count" Field="count" GroupFunction="Sum" /><GroupField Name="currentmax" Field="current_max" GroupFunction="Sum" /><GroupField Name="currentmin" Field="current_min" GroupFunction="Sum" /><GroupField Name="frequencymax" Field="frequency_max" GroupFunction="Sum" /><GroupField Name="frequencymin" Field="frequency_min" GroupFunction="Sum" /><GroupField Name="pfmax" Field="pf_max" GroupFunction="Sum" /><GroupField Name="pfmin" Field="pf_min" GroupFunction="Sum" /><GroupField Name="vllmax" Field="vll_max" GroupFunction="Sum" /><GroupField Name="vllmin" Field="vll_min" GroupFunction="Sum" /><GroupField Name="vlnmax" Field="vln_max" GroupFunction="Sum" /><GroupField Name="vlnmin" Field="vln_min" GroupFunction="Sum" /><GroupField Name="wattmax" Field="watts_max" GroupFunction="Sum" /><GroupField Name="wattmin" Field="watts_min" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="hour" SortDirection="Asc" SortGroupById="true" /><SortField Name="metername" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Hourly Energy Consumption",#*
      *#"aggFunc" : "sum",#*
      *##set($records = 0)#*
      *#"cols": [#*
        *#{"name": "date","type":"String","description":"Date", "description_cn":"日期"},#*
        *#{"name": "hour", "type": "String", "description": "Hour"},#*
        *#{"name": "metername", "type": "String", "description": "Meter"},#*
        *#{"name": "metergroup", "type": "String", "description": "Meter group 1"},#*
        *#{"name": "metersubgroup", "type": "String", "description": "Meter group 2"},#*
        *#{"name": "metersubsubgroup", "type": "String", "description": "Meter group 3"},#*
        *#{"name": "kwh", "type": "String", "description": "Consumption(kWh)"},#*
        *#{"name": "kvah", "type": "String", "description": "Consumption(kVAh)"},#*
        *#{"name": "currentmax", "type": "String", "description": "Max current(A)"},#*
        *#{"name": "currentmin", "type": "String", "description": "Min current(A)"},#*
        *#{"name": "currentavg", "type": "String", "description": "Avg current(A)"},#*
        *#{"name": "frequencymax", "type": "String", "description": "Max frequency(Hz)"},#*
        *#{"name": "frequencymin", "type": "String", "description": "Min frequency(Hz)"},#*
        *#{"name": "frequencyavg", "type": "String", "description": "Avg frequency(Hz)"},#*
        *#{"name": "pfmax", "type": "String", "description": "Max power factor"},#*
        *#{"name": "pfmin", "type": "String", "description": "Min power factor"},#*
        *#{"name": "pfavg", "type": "String", "description": "Avg power factor"},#*
        *#{"name": "wattmax", "type": "String", "description": "Max power(W)"},#*
        *#{"name": "wattmin", "type": "String", "description": "Min power(W)"},#*
        *#{"name": "wattavg", "type": "String", "description": "Avg power(W)"},#*
        *#{"name": "vllmax", "type": "String", "description": "Max line to line voltage(V)"},#*
        *#{"name": "vllmin", "type": "String", "description": "Min line to line voltage(V)"},#*
        *#{"name": "vllavg", "type": "String", "description": "Avg line to line voltage(V)"},#*
        *#{"name": "vlnmax", "type": "String", "description": "Max phase voltage(V)"},#*
        *#{"name": "vlnmin", "type": "String", "description": "Min phase voltage(V)"},#*
        *#{"name": "vlnavg", "type": "String", "description": "Avg phase voltage(V)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($energy = $resultmap.energy)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##foreach($e in $energy)#*
          *##set($metername = '"-"')#*
          *##set($metergroup = '"-"')#*
          *##set($metersubgroup = '"-"')#*
          *##set($metersubsubgroup = '"-"')#*
          *##set($kwh = 0)#*
          *##set($kvah = 0)#*
          *##set($count = 0)#*
          *##set($currentmax = 0)#*
          *##set($currentmin = 0)#*
          *##set($currentavg = 0)#*
          *##set($frequencymax = 0)#*
          *##set($frequencymin = 0)#*
          *##set($frequencyavg = 0)#*
          *##set($pfmax = 0)#*
          *##set($pfmin = 0)#*
          *##set($pfavg = 0)#*
          *##set($wattmax = 0)#*
          *##set($wattmin = 0)#*
          *##set($wattavg = 0)#*
          *##set($vllmax = 0)#*
          *##set($vllmin = 0)#*
          *##set($vllavg = 0)#*
          *##set($vlnmax = 0)#*
          *##set($vlnmin = 0)#*
          *##set($vlnavg = 0)#*
          *##set($year = $e.get("_id").year)#*
          *##set($month = $e.get("_id").month)#*
          *##set($day = $e.get("_id").day)#*
          *##set($hour = $e.get("_id").hour)#*
          *##set($displayHour = $e.get("_id").displayHour)#*
          *##set($metername = $e.get("_id").metername)#*
          *##set($metergroup = $e.get("_id").metergroup)#*
          *##set($metersubgroup = $e.get("_id").metersubgroup)#*
          *##set($metersubsubgroup = $e.get("_id").metersubsubgroup)#*
          *##set($kwh = $e.get("kwh"))#*
          *##set($kwh = $math.roundTo(2, $kwh))#*
          *##set($kvah = $e.get("kvah"))#*
          *##set($kvah = $math.roundTo(2, $kvah))#*
          *##set($count = $e.get("count"))#*
          *##set($currentmax = $e.get("currentmax"))#*
          *##set($currentmin = $e.get("currentmin"))#*
          *##set($currentavg = $math.add($currentmax, $currentmin))#*
          *##set($currentavg = $math.div($currentavg, $count))#*
          *##set($currentavg = $math.roundTo(2, $currentavg))#*
          *##set($frequencymax = $e.get("frequencymax"))#*
          *##set($frequencymin = $e.get("frequencymin"))#*
          *##set($frequencyavg = $math.add($frequencymax, $frequencymin))#*
          *##set($frequencyavg = $math.div($frequencyavg, $count))#*
          *##set($frequencyavg = $math.roundTo(2, $frequencyavg))#*
          *##set($pfmax = $e.get("pfmax"))#*
          *##set($pfmin = $e.get("pfmin"))#*
          *##set($pfavg = $math.add($pfmax, $pfmin))#*
          *##set($pfavg = $math.div($pfavg, $count))#*
          *##set($pfavg = $math.roundTo(2, $pfavg))#*
          *##set($wattmax = $e.get("wattmax"))#*
          *##set($wattmin = $e.get("wattmin"))#*
          *##set($wattavg = $math.add($wattmax, $wattmin))#*
          *##set($wattavg = $math.div($wattavg, $count))#*
          *##set($wattavg = $math.roundTo(2, $wattavg))#*
          *##set($vllmax = $e.get("vllmax"))#*
          *##set($vllmin = $e.get("vllmin"))#*
          *##set($vllavg = $math.add($vllmax, $vllmin))#*
          *##set($vllavg = $math.div($vllavg, $count))#*
          *##set($vllavg = $math.roundTo(2, $vllavg))#*
          *##set($vlnmax = $e.get("vlnmax"))#*
          *##set($vlnmin = $e.get("vlnmin"))#*
          *##set($vlnavg = $math.add($vlnmax, $vlnmin))#*
          *##set($vlnavg = $math.div($vlnavg, $count))#*
          *##set($vlnavg = $math.roundTo(2, $vlnavg))#*
          *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
          *##if($records > 0)#* 
            *#,#* 
          *##end#*
          *#{#*
            *#"date": $date,#*
            *#"hour": $displayHour,#*
            *#"metername": $metername,#*
            *#"metergroup": $metergroup,#*
            *#"metersubgroup": $metersubgroup,#*
            *#"metersubsubgroup": $metersubsubgroup,#*
            *#"kwh": $kwh,#*
            *#"kvah": $kvah,#*
            *#"currentmax": $currentmax,#*
            *#"currentmin": $currentmin,#*
            *#"currentavg": $currentavg,#*
            *#"frequencymax": $frequencymax,#*
            *#"frequencymin": $frequencymin,#*
            *#"frequencyavg": $frequencyavg,#*
            *#"pfmax": $pfmax,#*
            *#"pfmin": $pfmin,#*
            *#"pfavg": $pfavg,#*
            *#"wattmax": $wattmax,#*
            *#"wattmin": $wattmin,#*
            *#"wattavg": $wattavg,#*
            *#"vllmax": $vllmax,#*
            *#"vllmin": $vllmin,#*
            *#"vllavg": $vllavg,#*
            *#"vlnmax": $vlnmax,#*
            *#"vlnmin": $vlnmin,#*
            *#"vlnavg": $vlnavg#*
          *#}#*
          *##set($records=$records+1)#*
        *##end#*
      *#],#*
      *#"records" : $records#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'SHIFTWISE',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'shiftwiseenergyconsumption',
    reportDescription: 'Shiftwise Energy Consumption',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'energy',
        reportObjectDesc: 'energy',
        reportObjectParameters: [
          'siteid',
          'start',
          'end',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="shiftwiseenergyconsumption" Description="Shiftwise Energy Consumption" Database="emgda" Host="localhost" Port="27017"><DataObject Name="energy" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;utility&quot; &amp;&amp; date &gt;= start  &amp;&amp;  date &lt;= end"/></Pipeline><Pipeline><Group><Key Name="metername" Field="metername" /><Key Name="metergroup" Field="metergroup" /><Key Name="metersubgroup" Field="metersubgroup" /><Key Name="metersubsubgroup" Field="metersubsubgroup" /><Key Name="year" Field="year" /><Key Name="month" Field="month" /><Key Name="day" Field="day" /><Key Name="shift" Field="shift" /><Key Name="displayHour" Field="displayHour" /><GroupField Name="kvah" Field="kvah_sum" GroupFunction="Sum" /><GroupField Name="kwh" Field="kwh_sum" GroupFunction="Sum" /><GroupField Name="count" Field="count" GroupFunction="Sum" /><GroupField Name="currentmax" Field="current_max" GroupFunction="Sum" /><GroupField Name="currentmin" Field="current_min" GroupFunction="Sum" /><GroupField Name="frequencymax" Field="frequency_max" GroupFunction="Sum" /><GroupField Name="frequencymin" Field="frequency_min" GroupFunction="Sum" /><GroupField Name="pfmax" Field="pf_max" GroupFunction="Sum" /><GroupField Name="pfmin" Field="pf_min" GroupFunction="Sum" /><GroupField Name="vllmax" Field="vll_max" GroupFunction="Sum" /><GroupField Name="vllmin" Field="vll_min" GroupFunction="Sum" /><GroupField Name="vlnmax" Field="vln_max" GroupFunction="Sum" /><GroupField Name="vlnmin" Field="vln_min" GroupFunction="Sum" /><GroupField Name="wattmax" Field="watts_max" GroupFunction="Sum" /><GroupField Name="wattmin" Field="watts_min" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="year" SortDirection="Asc" SortGroupById="true" /><SortField Name="month" SortDirection="Asc" SortGroupById="true" /><SortField Name="day" SortDirection="Asc" SortGroupById="true" /><SortField Name="shift" SortDirection="Asc" SortGroupById="true" /><SortField Name="metername" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Shiftwise Energy Consumption",#*
      *#"aggFunc" : "sum",#*
      *##set($records = 0)#*
      *#"cols": [#*
        *#{"name": "date","type":"String","description":"Date", "description_cn":"日期"},#*
        *#{"name": "shift", "type": "String", "description": "Shift"},#*
        *#{"name": "metername", "type": "String", "description": "Meter"},#*
        *#{"name": "metergroup", "type": "String", "description": "Meter group 1"},#*
        *#{"name": "metersubgroup", "type": "String", "description": "Meter group 2"},#*
        *#{"name": "metersubsubgroup", "type": "String", "description": "Meter group 3"},#*
        *#{"name": "kwh", "type": "String", "description": "Consumption(kWh)"},#*
        *#{"name": "kvah", "type": "String", "description": "Consumption(kVAh)"},#*
        *#{"name": "currentmax", "type": "String", "description": "Max current(A)"},#*
        *#{"name": "currentmin", "type": "String", "description": "Min current(A)"},#*
        *#{"name": "currentavg", "type": "String", "description": "Avg current(A)"},#*
        *#{"name": "frequencymax", "type": "String", "description": "Max frequency(Hz)"},#*
        *#{"name": "frequencymin", "type": "String", "description": "Min frequency(Hz)"},#*
        *#{"name": "frequencyavg", "type": "String", "description": "Avg frequency(Hz)"},#*
        *#{"name": "pfmax", "type": "String", "description": "Max power factor"},#*
        *#{"name": "pfmin", "type": "String", "description": "Min power factor"},#*
        *#{"name": "pfavg", "type": "String", "description": "Avg power factor"},#*
        *#{"name": "wattmax", "type": "String", "description": "Max power(W)"},#*
        *#{"name": "wattmin", "type": "String", "description": "Min power(W)"},#*
        *#{"name": "wattavg", "type": "String", "description": "Avg power(W)"},#*
        *#{"name": "vllmax", "type": "String", "description": "Max line to line voltage(V)"},#*
        *#{"name": "vllmin", "type": "String", "description": "Min line to line voltage(V)"},#*
        *#{"name": "vllavg", "type": "String", "description": "Avg line to line voltage(V)"},#*
        *#{"name": "vlnmax", "type": "String", "description": "Max phase voltage(V)"},#*
        *#{"name": "vlnmin", "type": "String", "description": "Min phase voltage(V)"},#*
        *#{"name": "vlnavg", "type": "String", "description": "Avg phase voltage(V)"}#*
      *#],#*
      *#"reportData" : [#*
        *##set($energy = $resultmap.energy)#*
        *##set($quot = '"')#*
        *##set($concat = '-')#*
        *##foreach($e in $energy)#*
          *##set($metername = '"-"')#*
          *##set($metergroup = '"-"')#*
          *##set($metersubgroup = '"-"')#*
          *##set($metersubsubgroup = '"-"')#*
          *##set($kwh = 0)#*
          *##set($kvah = 0)#*
          *##set($count = 0)#*
          *##set($currentmax = 0)#*
          *##set($currentmin = 0)#*
          *##set($currentavg = 0)#*
          *##set($frequencymax = 0)#*
          *##set($frequencymin = 0)#*
          *##set($frequencyavg = 0)#*
          *##set($pfmax = 0)#*
          *##set($pfmin = 0)#*
          *##set($pfavg = 0)#*
          *##set($wattmax = 0)#*
          *##set($wattmin = 0)#*
          *##set($wattavg = 0)#*
          *##set($vllmax = 0)#*
          *##set($vllmin = 0)#*
          *##set($vllavg = 0)#*
          *##set($vlnmax = 0)#*
          *##set($vlnmin = 0)#*
          *##set($vlnavg = 0)#*
          *##set($year = $e.get("_id").year)#*
          *##set($month = $e.get("_id").month)#*
          *##set($day = $e.get("_id").day)#*
          *##set($shift = $e.get("_id").shift)#*
          *##set($metername = $e.get("_id").metername)#*
          *##set($metergroup = $e.get("_id").metergroup)#*
          *##set($metersubgroup = $e.get("_id").metersubgroup)#*
          *##set($metersubsubgroup = $e.get("_id").metersubsubgroup)#*
          *##set($kwh = $e.get("kwh"))#*
          *##set($kwh = $math.roundTo(2, $kwh))#*
          *##set($kvah = $e.get("kvah"))#*
          *##set($kvah = $math.roundTo(2, $kvah))#*
          *##set($count = $e.get("count"))#*
          *##set($currentmax = $e.get("currentmax"))#*
          *##set($currentmin = $e.get("currentmin"))#*
          *##set($currentavg = $math.add($currentmax, $currentmin))#*
          *##set($currentavg = $math.div($currentavg, $count))#*
          *##set($currentavg = $math.roundTo(2, $currentavg))#*
          *##set($frequencymax = $e.get("frequencymax"))#*
          *##set($frequencymin = $e.get("frequencymin"))#*
          *##set($frequencyavg = $math.add($frequencymax, $frequencymin))#*
          *##set($frequencyavg = $math.div($frequencyavg, $count))#*
          *##set($frequencyavg = $math.roundTo(2, $frequencyavg))#*
          *##set($pfmax = $e.get("pfmax"))#*
          *##set($pfmin = $e.get("pfmin"))#*
          *##set($pfavg = $math.add($pfmax, $pfmin))#*
          *##set($pfavg = $math.div($pfavg, $count))#*
          *##set($pfavg = $math.roundTo(2, $pfavg))#*
          *##set($wattmax = $e.get("wattmax"))#*
          *##set($wattmin = $e.get("wattmin"))#*
          *##set($wattavg = $math.add($wattmax, $wattmin))#*
          *##set($wattavg = $math.div($wattavg, $count))#*
          *##set($wattavg = $math.roundTo(2, $wattavg))#*
          *##set($vllmax = $e.get("vllmax"))#*
          *##set($vllmin = $e.get("vllmin"))#*
          *##set($vllavg = $math.add($vllmax, $vllmin))#*
          *##set($vllavg = $math.div($vllavg, $count))#*
          *##set($vllavg = $math.roundTo(2, $vllavg))#*
          *##set($vlnmax = $e.get("vlnmax"))#*
          *##set($vlnmin = $e.get("vlnmin"))#*
          *##set($vlnavg = $math.add($vlnmax, $vlnmin))#*
          *##set($vlnavg = $math.div($vlnavg, $count))#*
          *##set($vlnavg = $math.roundTo(2, $vlnavg))#*
          *##set($date = $quot+$day+$concat+$month+$concat+$year+$quot)#*
          *##if($records > 0)#* 
            *#,#* 
          *##end#*
          *#{#*
            *#"date": $date,#*
            *#"shift": $shift,#*
            *#"metername": $metername,#*
            *#"metergroup": $metergroup,#*
            *#"metersubgroup": $metersubgroup,#*
            *#"metersubsubgroup": $metersubsubgroup,#*
            *#"kwh": $kwh,#*
            *#"kvah": $kvah,#*
            *#"currentmax": $currentmax,#*
            *#"currentmin": $currentmin,#*
            *#"currentavg": $currentavg,#*
            *#"frequencymax": $frequencymax,#*
            *#"frequencymin": $frequencymin,#*
            *#"frequencyavg": $frequencyavg,#*
            *#"pfmax": $pfmax,#*
            *#"pfmin": $pfmin,#*
            *#"pfavg": $pfavg,#*
            *#"wattmax": $wattmax,#*
            *#"wattmin": $wattmin,#*
            *#"wattavg": $wattavg,#*
            *#"vllmax": $vllmax,#*
            *#"vllmin": $vllmin,#*
            *#"vllavg": $vllavg,#*
            *#"vlnmax": $vlnmax,#*
            *#"vlnmin": $vlnmin,#*
            *#"vlnavg": $vlnavg#*
          *#}#*
          *##set($records=$records+1)#*
        *##end#*
      *#],#*
      *#"records" : $records#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'MONTHLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'monthlypartrejection',
    reportDescription: 'Top rejections, part wise, in the last Month',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'rejection',
        reportObjectDesc: 'rejection',
        reportObjectParameters: [
          'siteid',
          'yearVal',
          'monthVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="monthlypartrejection" Description="Top rejections, part wise, in the last Month" Database="emgda" Host="localhost" Port="27017"><DataObject Name="rejection" Collection="rejection"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;rejection&quot; &amp;&amp; year == yearVal &amp;&amp; month == monthVal"/></Pipeline><Pipeline><Group><Key Name="partname" Field="partname" /><GroupField Name="totalRejection" Field="quantity" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totalRejection" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Top rejections, part wise, in the last Month",#*
      *#"type" : "CHART",#*
      *##set($rejection = $resultmap.rejection)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": ""#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($reject in $rejection)#*
          *##set($partname = $reject.get("_id").partname)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$partname#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Total rejections",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($reject in $rejection)#*
          *##set($totalRejection = $reject.get("totalRejection"))#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$totalRejection#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'WEEKLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'topdowntimereasonsinaweek',
    reportDescription: 'Top Downtime Reasons In A Week',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'downtime',
        reportObjectDesc: 'downtime',
        reportObjectParameters: [
          'siteid',
          'yearVal',
          'weekVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="topdowntimereasonsinaweek" Description="Top Downtime Reasons In A Week" Database="emgda" Host="localhost" Port="27017"><DataObject Name="downtime" Collection="downtime"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;downtime&quot; &amp;&amp; year == yearVal &amp;&amp; week == weekVal"/></Pipeline><Pipeline><Group><Key Name="downtimereason" Field="reasonname" /><GroupField Name="totaldowntime" Field="downtimeinms" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totaldowntime" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline><Pipeline><Limit Name="elementName" Count="5" /></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Top Downtime Reasons In A Week",#*
      *#"type" : "CHART",#*
      *##set($downtime = $resultmap.downtime)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": ""#*
        *#},#*
        *#"chart": {#*
          *#"type": "column"#*
        *#},#*
        *#"tooltip": {#*
          *#"shared": true#*
        *#},#*
        *#"yAxis": [{#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}, {#*
          *#"title": {#*
            *#"text": ""#*
          *#},#*
          *#"minPadding": 0,#*
          *#"maxPadding": 0,#*
          *#"max": 100,#*
          *#"min": 0,#*
          *#"opposite": true,#*
          *#"labels": {#*
            *#"format": "{value}%"#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($downtimereason = '"No reason"')#*
          *##set($downtimereason = $down.get("_id").downtimereason)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
            *#$downtimereason#*
            *##set($count=$count+1)#*
          *##end#*
            *#],#*
            *#"crosshair": true#*
        *#},#*
        *#"series" : [{#*
          *#"type": "pareto",#*
          *#"showInLegend" : false,#*
          *#"name": "Pareto",#*
          *#"yAxis": 1,#*
          *#"zIndex": 10,#*
          *#"baseSeries": 1,#*
          *#"tooltip": {#*
            *#"valueDecimals": 2,#*
            *#"valueSuffix": "%"#*
          *#}#*
        *#}, {#*
          *#"name" : "Downtime (in mins)",#*
          *#"type" : "column",#*
          *#"showInLegend" : false,#*
          *#"zIndex" : 2,#*
          *#"data" : [#*
          *##set($count = 0)#*
          *##foreach($down in $downtime)#*
          *##set($downtimereason = '"No reason"')#*
          *##set($downtimereason = $down.get("_id").downtimereason)#*
          *##set($totaldowntimeinms = $down.get("totaldowntime"))#*
          *##set($totaldowntimeinsec = $math.div($totaldowntimeinms, 1000))#*
          *##set($totaldowntimeinmins = $math.div($totaldowntimeinsec, 60))#*
          *##set($totaldowntimeinmins = $math.roundTo(2, $totaldowntimeinmins))#*
          *##set($h = $math.div($totaldowntimeinsec, 3600))#*
          *##set($h = $math.floor($h))#*
          *##set($m = $math.mod($totaldowntimeinsec, 3600))#*
          *##set($m = $math.div($m, 60))#*
          *##set($m = $math.floor($m))#*
          *##set($s = $math.mod($totaldowntimeinsec, 3600))#*
          *##set($s = $math.mod($s, 60))#*
          *##set($s = $math.floor($s))#*
          *##set($totaldowntime = $quot+$h+$sep+$m+$sep+$s+$quot)#*
          *##if($count > 0)#* 
            *#,#* 
          *##end#*
          *#$totaldowntimeinmins#*
          *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#}]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'WEEKLY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'weeklymachineproduction',
    reportDescription: 'Weekly parts produced, machine wise',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'yearVal',
          'weekVal',
        ],
      },
      {
        reportObjectname: 'machines',
        reportObjectDesc: 'machines',
        reportObjectParameters: [
          'siteid',
          'yearVal',
          'weekVal',
        ],
      },
      {
        reportObjectname: 'parts',
        reportObjectDesc: 'parts',
        reportObjectParameters: [
          'siteid',
          'yearVal',
          'weekVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="weeklymachineproduction" Description="Weekly parts produced, machine wise" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; year == yearVal &amp;&amp;  week == weekVal"/></Pipeline><Pipeline><Group><Key Name="partname" Field="partname" /><Key Name="machinename" Field="machinename" /><GroupField Name="totalproduction" Field="qty" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="totalproduction" SortDirection="Desc" SortGroupById="false" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="machines" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; year == yearVal &amp;&amp;  week == weekVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /></Group></Pipeline><Pipeline><Sort><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="parts" Collection="aggregatehourly"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; year == yearVal &amp;&amp;  week == weekVal"/></Pipeline><Pipeline><Group><Key Name="partname" Field="partname" /></Group></Pipeline><Pipeline><Sort><SortField Name="partname" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Weekly parts produced, machine wise",#*
      *#"type" : "CHART",#*
      *##set($cycletime = $resultmap.cycletime)#*
      *##set($machines = $resultmap.machines)#*
      *##set($parts = $resultmap.parts)#*
      *#"chartOptions": {#*
        *#"title": {#*
         *#"text": ""#*
        *#},#*
        *#"chart": {#*
          *#"type": "bar"#*
        *#},#*
        *#"yAxis": [{#*
          *#"min": 0,#*
          *#"title": {#*
            *#"text": ""#*
          *#}#*
        *#}],#*
        *#"xAxis": {#*
          *#"categories": [#*
          *##set($count = 0)#*
          *##set($machinename = '"-"')#*
          *##foreach($machine in $machines)#*
            *##set($machinename = $machine.get("_id").machinename)#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
              *#$machinename#*
              *##set($count=$count+1)#*
          *##end#*
          *#]#*
        *#},#*
        *#"legend": {#*
          *#"reversed": true#*
        *#},#*
        *#"plotOptions": {#*
          *#"series": {#*
            *#"stacking": "normal"#*
          *#}#*
        *#},#*
        *#"series" : [#*
          *##set($count = 0)#*
          *##foreach($part in $parts)#*
            *##set($partname = $part.get("_id").partname)#*
            *##if($count > 0)#* 
              *#,#* 
            *##end#*
            *#{"name" : $partname,#*
            *#"data" : [#*
            *##set($dataCount = 0)#*
            *##foreach($machine in $machines)#*
              *##set($m = "'-'")#*
              *##set($res = 0)#*
              *##set($machinename = $machine.get("_id").machinename)#*
               *##if($dataCount > 0)#* 
                *#,#* 
              *##end#*
              *##foreach($cycle in $cycletime)#*
                *##set($pname = $cycle.get("_id").partname)#*
                *##set($mname = $cycle.get("_id").machinename)#*
                *##set($totalproduction = $cycle.get("totalproduction"))#*
                *##set($production = "'-'")#*
                *##if($partname == $pname)#* 
                  *##if($machinename == $mname)#* 
                    *##set($production = $totalproduction)#*
                    *#$production#*
                    *##set($m = $machinename)#*
                    *##set($res = 1)#*
                  *##else#*
                    *##if($res == 0)#*  
                      *##set($m = "'-'")#*
                    *##end#*
                  *##end#*
                *##end#*
              *##end#*
              *##set($dataCount=$dataCount+1)#*
              *##if($m == "'-'")#* 
                *##set($production = 0)#*
                *#$production#*
              *##end#*
            *##end#*
            *#]#*
            *#}#*
            *##set($count=$count+1)#*
          *##end#*
        *#]#*
      *#}#*
    *#}`,
  },
  {
    category: 'standard',
    aggregationType: 'DAILY',
    reportRenderType: 'JSON',
    reportType: 'multiple element based',
    reportName: 'yesterdaysproductionsummary',
    reportDescription: 'Yesterdays Production',
    reportaccess: [],
    reportObjects: [
      {
        reportObjectname: 'cycletime',
        reportObjectDesc: 'cycletime',
        reportObjectParameters: [
          'siteid',
          'dateVal',
        ],
      },
      {
        reportObjectname: 'machines',
        reportObjectDesc: 'machines',
        reportObjectParameters: [
          'siteid',
          'dateVal',
        ],
      },
    ],
    reportXml: '<mon:Mongobot xmlns:mon="http://mongobot.entrib.com" Name="yesterdaysproductionsummary" Description="Yesterdays Production" Database="emgda" Host="localhost" Port="27017"><DataObject Name="cycletime" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date == dateVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /><Key Name="partname" Field="partname" /><GroupField Name="totalProduction" Field="qty" GroupFunction="Sum" /></Group></Pipeline><Pipeline><Sort><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /><SortField Name="partname" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject><DataObject Name="machines" Collection="aggregateshift"><Aggregate><Pipeline><Match Condition="siteId == siteid &amp;&amp; elementName == &quot;cycletime&quot; &amp;&amp; date == dateVal"/></Pipeline><Pipeline><Group><Key Name="machinename" Field="machinename" /></Group></Pipeline><Pipeline><Sort><SortField Name="machinename" SortDirection="Asc" SortGroupById="true" /></Sort></Pipeline></Aggregate></DataObject></mon:Mongobot>',
    reportVm: `{#*
      *#"name" : "Yesterday's production summary",#*
      *#"type" : "HTML",#*
      *##set($production = $resultmap.cycletime)#*
      *##set($machines = $resultmap.machines)#*
      *#"html": "#*
        *##set($totalProduction = 0)#*
        *##foreach($prod in $production)#*
          *##set($totalProduction = $math.add($totalProduction, $prod.get("totalProduction")))#*
        *##end#*
        *#Yesterday, there were <b>$totalProduction</b> <i>parts</i> produced on <b>$machines.size()</b> different <i>machines</i>#*
        *#<br><br>#*
         *#<table style='width: 100%;border-collapse: collapse;'>#*
          *#<tr>#*
            *#<th style='border: 1px solid #dddddd;text-align: left;padding: 8px;'>#*
              *#Machine#*
            *#</th>#*
            *#<th style='border: 1px solid #dddddd;text-align: left;padding: 8px;'>#*
              *#Part#*
            *#</th>#*
            *#<th style='border: 1px solid #dddddd;text-align: right;padding: 8px;'>#*
              *#Production#*
            *#</th>#*
          *#</tr>#*
          *##foreach($prod in $production)#*
            *#<tr>#*
              *#<td style='border: 1px solid #dddddd;text-align: left;padding: 8px;'>#*
                *##set($mac = $prod.get("_id").machinename)#*
                *##set($mac = "$mac")#*
                *##set($strlen = $mac.length())#*
                *##set($strlen = $math.sub($strlen,1))#*
                *##set($mac = $mac.substring(1,$strlen))#*
                *#$mac#*
              *#</td>#*
              *#<td style='border: 1px solid #dddddd;text-align: left;padding: 8px;'>#*
                *##set($part = $prod.get("_id").partname)#*
                *##set($part = "$part")#*
                *##set($strlen = $part.length())#*
                *##set($strlen = $math.sub($strlen,1))#*
                *##set($part = $part.substring(1,$strlen))#*
                *#$part#*
              *#</td>#*
              *#<td style='border: 1px solid #dddddd;text-align: right;padding: 8px;'>#*
                *#$prod.get("totalProduction")#*
              *#</td>#*
            *#</tr>#*
          *##end#*
         *#</table>#*
      *#"#*
    *#}}`,
  },
];
