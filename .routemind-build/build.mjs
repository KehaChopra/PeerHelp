import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
process.env.RUNTIME_NODE_MODULES='C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const root=process.cwd(), tmp=path.join(root,'.routemind-build');
const skill='C:/Users/HP/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(skill+'/container_tools/artifact_tool_utils.mjs'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={bg:'#F7FBFE',ink:'#15334B',muted:'#526E80',line:'#85AFC9',cream:'#FFFFFF',tan:'#D2EAF9',olive:'#2874A1'};
let s;
function shape(x,y,w,h,geo='rect',fill=C.cream){return s.shapes.add({geometry:geo,position:{left:x,top:y,width:w,height:h},fill,line:{fill:C.line,width:1.6}});}
function text(t,x,y,w,h,size=25,bold=false,color=C.ink,align='left'){let q=shape(x,y,w,h,'textbox','none');q.line={fill:'none',width:0};q.text=t;q.text.style={typeface:'Arial',fontSize:size,bold,color,alignment:align,verticalAlignment:'middle',autoFit:'none',insets:{left:0,right:0,top:0,bottom:0}};return q;}
function box(t,x,y,w,h,geo='rect',fill=C.cream,size=24){let q=shape(x,y,w,h,geo,fill);q.text=t;q.text.style={typeface:'Arial',fontSize:size,color:C.ink,alignment:'center',verticalAlignment:'middle',insets:{left:10,right:10,top:5,bottom:5}};return q;}
function line(x1,y1,x2,y2,dash=false){return s.shapes.add({geometry:'line',position:{left:Math.min(x1,x2),top:Math.min(y1,y2),width:Math.abs(x2-x1)||0.01,height:Math.abs(y2-y1)||0.01,verticalFlip:y2<y1},fill:'none',line:{fill:C.line,width:1.7,style:dash?'dashed':'solid'}});}
function link(a,b,from='right',to='left',arrow=true,kind='straight'){return s.shapes.connect(a,b,{kind,fromSide:from,toSide:to,line:{fill:C.muted,width:1.8},tail:{type:arrow?'triangle':'none',width:'sm',length:'sm'}});}
function arrow(x1,y1,x2,y2){let a=shape(x1,y1,0.1,0.1,'rect','none'),b=shape(x2,y2,.1,.1,'rect','none');a.line=b.line={fill:'none',width:0};return link(a,b);}
function base(title,n,sub=''){s=p.slides.add();s.background.fill=C.bg;text(title,65,45,1470,64,44,true);if(sub)text(sub,65,116,1450,42,24,false,C.muted);text('RouteMind',65,849,400,22,18,false,C.muted);text(String(n).padStart(2,'0'),1465,845,70,28,20,false,C.muted,'right');return s;}
function note(t){s.speakerNotes.textFrame.setText(t);}
function caption(t){text(t,65,786,1470,46,23,false,C.muted);}
function storeBox(t,x,y,w=300,h=58){let q=box(t,x,y,w,h,'rect','#F1EBDD',22);line(x+17,y,x+17,y+h);return q;}
// Cover
base('SOFTWARE ENGINEERING PROJECT',1);
text('RouteMind',65,232,1470,142,112,true);
text('Logistics Route Optimization',72,412,1430,80,51);
text('Delivery planning for small businesses',75,508,1390,49,30,false,C.muted);
text('Presented by',75,653,900,33,24,false,C.muted);
text('Keha Chopra     Suhani     Palavi     Ishita',75,708,1430,51,32);
note('RouteMind is a proposed web-based delivery planning system for small businesses. It plans routes for multiple orders and vehicles while considering load capacity, order priority and delivery time windows. This presentation covers the problem, context DFD, Level 1 decomposition, Level 2 route optimization, algorithm approach and system architecture.');
// Problem and proposed solution
base('The delivery planning problem',2,'A short route alone may still miss a delivery window or exceed a vehicle’s capacity.');
text('What businesses need to manage',65,213,690,48,31,true);
const constraints=[['Multiple deliveries','A useful stop sequence for each driver.'],['Vehicle capacity','Loads must fit the assigned vehicle.'],['Priority and time windows','Urgent orders and customer availability matter.'],['Multiple drivers','Work must match available drivers and vehicles.']];
constraints.forEach((r,i)=>{let y=298+i*109;text(r[0],65,y,650,37,28,true);text(r[1],65,y+42,670,41,25,false,C.muted);});
text('RouteMind’s proposed solution',825,213,690,48,31,true);
text('INPUT',825,300,170,31,20,true,C.olive);text('Orders, locations, vehicles, drivers,\ncapacity, priority and time limits',825,341,690,82,29);
text('PLANNING',825,464,200,31,20,true,C.olive);text('Validate inputs and find a feasible\nroute plan with a lower travel cost.',825,505,680,83,29);
text('OUTPUT',825,630,170,31,20,true,C.olive);text('Driver routes, estimated arrival times,\ndelivery progress and analytics',825,671,690,83,29);
caption('When an order changes, RouteMind recalculates the remaining deliveries and informs the affected driver.');
note('This is a proposal, not a claim of measured savings. The system accepts delivery addresses, order load, priority, time windows and service time, plus vehicle capacities and driver availability. It validates the inputs, prepares routes and monitors delivery updates. Capacity and time windows can be treated as hard limits. Priority helps order feasible deliveries. Added, cancelled or delayed orders trigger replanning of unfinished stops while preserving completed deliveries. Infeasible orders are flagged for the business to resolve.');
// Context DFD
base('DFD Level 0: system context',3,'One system process exchanges data with four external entities.');
let rm=box('0\nRouteMind',585,348,430,216,'ellipse',C.tan,37);
box('Business / Admin',65,225,310,105,'rect',C.cream,29);
box('Driver',65,635,310,105,'rect',C.cream,29);
box('Customer',1220,225,310,105,'rect',C.cream,29);
box('Map / Routing API',1220,635,310,105,'rect',C.cream,27);
arrow(375,277,623,374);text('Orders, fleet details,\nconstraints, report requests',405,223,370,73,22);
arrow(592,426,375,330);text('Route plans, analytics,\nexceptions',65,376,435,73,22);
arrow(375,659,617,524);text('Delivery status,\ncurrent location',65,535,325,68,22);
arrow(690,562,375,723);text('Assigned route,\nroute updates',445,696,300,68,22);
arrow(1220,273,986,382);text('Delivery preferences,\naddress corrections',900,218,315,74,22);
arrow(1011,434,1220,330);text('Estimated arrival,\ndelivery status',1170,385,350,74,22);
arrow(1003,496,1220,657);text('Coordinates,\ndistance / route request',1172,521,360,78,22);
arrow(1220,717,962,554);text('Locations, distances,\nestimated travel times',858,701,385,72,22);
caption('Arrows represent information exchanged. The system’s internal modules are shown on the next slide.');
note('Context DFD: Business/Admin submits orders, fleet details, planning constraints and analytics requests. RouteMind returns route plans, analytics and exceptions. Driver sends current location and delivery events and receives assigned routes and changes. Customer supplies delivery preferences or address corrections and receives an estimated arrival time and delivery status. The customer input is an assumed proposed feature to make the customer interaction explicit. RouteMind queries a Map/Routing API and receives location, distance and travel-time data. Rectangles denote external entities and the ellipse denotes the complete system.');
// Level 1
base('DFD Level 1: six connected modules',4,'The stores preserve operational data and the results of every optimization run.');
text('EXTERNAL DATA',65,184,430,28,19,true,C.muted);text('PROCESS',597,184,380,28,19,true,C.muted);text('PRIMARY DATA STORES',1190,184,350,28,19,true,C.muted);
let data=[
['Business / Customer','Orders / preferences','Order details / exceptions','1  Manage Orders','D2  Orders'],
['Business / Admin','Fleet / account details','Driver and vehicle records','2  Manage Drivers & Vehicles','D1  Users/Businesses\nD3  Vehicles     D4  Drivers'],
['Business / Admin','Planning constraints','Validation issues','3  Validate Constraints','D2  Orders     D3  Vehicles\nD4  Drivers'],
['Map / Routing API','Distances / travel times','Location / distance query','4  Optimize Routes','D5  Routes     D6  Locations\nD8  Optimization Runs'],
['Driver / Customer','Location / delivery events','Route / ETA / status','5  Track Deliveries','D5  Routes     D6  Locations\nD7  Delivery Events'],
['Business / Admin','Report request','Delivery analytics','6  Generate Analytics','D5  Routes     D7  Events\nD8  Optimization Runs']];
data.forEach((r,i)=>{let y=237+i*87;box(r[0],65,y,280,57,'rect',C.cream,21);box(r[3],607,y,380,57,'roundRect',C.tan,23);storeBox(r[4],1237,y,300,57);arrow(345,y+16,607,y+16);text(r[1],354,y-12,252,26,17);arrow(607,y+48,345,y+48);text(r[2],352,y+49,260,26,17);if(i!==2 && i!==5){arrow(987,y+16,1237,y+16);text('Stored records',1012,y-12,215,25,18);}arrow(1237,y+48,987,y+48);text('Retrieved records',1007,y+49,228,26,18);});
text('Internal flows: 1 + 2 supply delivery data to 3. 3 sends valid inputs to 4. 4 sends route plans to 5.\n5 sends changed delivery data to 4 for replanning. 6 reads route, event and optimization records.',65,774,1470,59,21,false,C.muted);
note('Level 1 decomposition: 1 manages orders, addresses and preferences in D2. 2 manages business records in D1, vehicle records in D3 and driver records in D4. 3 validates orders against capacities, availability and planning constraints, reading D2/D3/D4 and returning input problems to the business. 4 receives validated inputs from 3, uses map data and D6, stores route plans in D5 and run metrics or failures in D8, and sends plans to 5 and the Business. 5 receives driver locations and delivery events, updates D6/D7 and route progress in D5, sends ETA/status to Customer and route updates to Driver, and sends changed delivery data to 4 for replanning. 6 reads D5/D7/D8 to produce requested analytics. Repeated store labels refer to the same stores. The internal flows are explicitly stated below the diagram to avoid overlapping lines. Customer inputs are handled by 1; the combined actor label in 5 does not imply that customers send driver location events.');
// Level 2
base('DFD Level 2: Optimize Routes',5,'Process 4 transforms validated delivery data into a feasible route plan and run metrics.');
storeBox('D2  Orders',65,191,310,54);storeBox('D3  Vehicles / D4  Drivers',446,191,310,54);storeBox('D6  Locations',825,191,310,54);box('Map / Routing API',1205,191,330,54,'rect',C.cream,23);
const xx=[65,446,825,1205],ww=[310,310,310,330];
let aa=[];['4.1  Receive orders','4.2  Retrieve constraints','4.3  Get distances','4.4  Generate initial route'].forEach((v,i)=>aa.push(box(v,xx[i],342,ww[i],90,'roundRect',C.tan,25)));
for(let i=0;i<3;i++){arrow(xx[i]+ww[i],388,xx[i+1],388);text(['Order\nset','Delivery\ninputs','Matrix'][i],xx[i]+ww[i]-9,i===2?385:282,90,55,18,false,C.muted,'center');}
arrow(220,245,220,342);text('Order data',70,266,160,29,19);
arrow(601,245,601,342);text('Capacity / time limits',430,264,285,31,19);
arrow(980,245,980,342);text('Coordinates',830,264,180,29,19);
arrow(1240,245,1080,342);arrow(1040,342,1200,245);text('Queries / distance data',1210,264,325,33,19);
let bot=[];['4.8  Store route','4.7  Calculate metrics','4.6  Check constraints','4.5  Apply optimization'].forEach((v,i)=>bot.push(box(v,xx[i],578,ww[i],90,'roundRect',C.tan,25)));
arrow(1370,432,1370,578);text('Initial route',1390,477,145,35,20);
for(let i=3;i>0;i--){arrow(xx[i],623,xx[i-1]+ww[i-1],623);text(['','Plan +\nmetrics','Feasible\nplan','Candidate\nroute'][i],xx[i]-83,531,95,48,18,false,C.muted,'center');}
arrow(1070,578,1070,483);arrow(1070,483,1280,483);arrow(1280,483,1280,578);text('Violations: revise candidate',983,446,355,30,19);
arrow(220,668,220,730);storeBox('D5  Routes',65,730,310,51);storeBox('D8  Optimization Runs',446,730,360,51);arrow(601,668,601,730);
text('No feasible route: record the exception\nand return unassigned orders to the business.',873,715,660,68,23,false,C.muted);
caption('All labelled arrows carry data. Process 4.5 uses greedy improvement and 2-opt / local search.');
note('Level 2 expands process 4. Receive Orders reads the validated order set. Retrieve Constraints adds capacity, driver availability, time windows and service times. Get Distances obtains a travel matrix from D6 and the Map API. Generate Initial Route constructs a feasible seed route where possible. Apply Optimization uses greedy improvement and 2-opt/local search to generate candidate routes. Check Constraints returns violation details for revision or sends a feasible plan to Calculate Metrics. Metrics include distance, estimated duration and a cost estimate based on supplied cost rules. Store Route writes D5 and the run outcome goes to D8. Infeasible orders remain explicit exceptions; the system must not silently break a hard constraint. A practical implementation needs a bounded search budget and a no-feasible-plan outcome. Map API requests and responses connect to 4.3 Get Distances. D6 supplies stored location data.');
// Algorithm explanation
base('Optimization & route recalculation',6,'The objective is a lower-cost feasible plan, rather than a guarantee of the global optimum.');
text('How the planner improves a route',65,213,820,45,31,true);
let algo=[['1  Build a starting plan','Choose feasible next stops using travel time,\npriority, remaining capacity and delivery windows.'],['2  Improve the stop sequence','Use 2-opt to reverse a route segment when it\nreduces cost and keeps all constraints satisfied.'],['3  Compare and keep the better plan','Check total distance, estimated duration and\nunassigned orders before saving the result.']];
algo.forEach((r,i)=>{let y=301+i*140;text(r[0],65,y,835,41,28,true);text(r[1],65,y+49,835,79,26,false,C.muted);});
text('When delivery plans change',987,213,545,45,31,true);
text('New or cancelled order\nDriver delay\nUpdated customer availability',987,301,540,122,28);
text('Replanning rule',987,474,540,39,28,true);
text('Keep completed stops fixed. Recalculate\nremaining deliveries from each driver’s\ncurrent location and remaining capacity.',987,530,535,135,27);
text('Publish the revised route and ETA\nto the affected driver and customer.',987,702,535,77,25,false,C.muted);
caption('Hard limits: capacity and required time windows. Priority influences the choice among feasible plans.');
note('A greedy rule makes a locally useful choice while constructing or improving a plan. It does not prove global optimality. A 2-opt move cuts two edges and reverses the intermediate sequence; the system accepts the change only if the route remains feasible and improves the objective. With multiple vehicles, initial allocation chooses feasible vehicle assignments and local search can also relocate orders between vehicles. Time windows require arrival-time and service-time checks. Replanning preserves completed deliveries and accounts for current location, remaining load and driver availability. Metrics are estimated, not promised savings.');
// Architecture
base('System architecture & expected outcome',7,'A proposed web application connects route planning, delivery tracking and map data.');
let f=box('Frontend\nBusiness, driver & customer views',65,260,397,152,'rect',C.cream,30),b=box('Backend\nPlanning & tracking services',607,260,395,152,'rect',C.tan,30),d=box('Database\nD1–D8 records',1147,260,387,152,'can',C.cream,30);
link(f,b);link(b,d);text('Requests /\nresponses',462,189,144,61,21,false,C.muted,'center');text('Read /\nwrite data',1003,189,145,61,21,false,C.muted,'center');
text('Order and fleet entry\nRoute and map view\nDelivery status and ETA\nBusiness analytics',65,451,430,149,27);
text('Authentication and access\nConstraint validation\nRoute optimization\nReplanning and notifications',607,451,464,149,27);
text('Orders, drivers and vehicles\nRoutes and locations\nDelivery events\nOptimization run history',1147,451,395,149,27);
let api=box('Map / Routing API',607,663,395,60,'rect','#F1EBDD',25);link(api,b,'right','right',true,'elbow');text('Location, distance and travel-time queries',65,672,522,47,23,false,C.muted);
text('Expected outcome',65,766,392,47,29,true,C.olive);text('More consistent planning, visible delivery progress\nand clear reporting of infeasible orders.',481,752,1045,79,29);
note('This is a proposed architecture rather than a claim of an implemented deployment. The frontend supports business planning, driver execution and customer status views. The backend enforces role-based authorization, validates data, computes routes, accepts delivery events and handles notifications. The database contains the eight named logical stores. A Map/Routing API supplies coordinates, distance and estimated travel time. Analytics can show planned versus actual duration, completed deliveries, pending deliveries and optimization run outcomes. API keys stay on the backend. Benefits are expected outcomes, with no invented performance or savings figures.');
await (await PresentationFile.exportPptx(p)).save(path.join(tmp,'candidate.pptx'));
for(let i=0;i<p.slides.items.length;i++){const blob=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(path.join(tmp,`slide-${i+1}.png`),new Uint8Array(await blob.arrayBuffer()));}
await finalizePresentation({workspaceDir:root,candidatePath:path.join(tmp,'candidate.pptx'),finalPath:path.join(root,'output','RouteMind_Deck.pptx'),explicitTotalSlideCount:7,pythonExecutable:'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation-delivery.json')});
console.log('DONE');
