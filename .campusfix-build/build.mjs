import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
process.env.RUNTIME_NODE_MODULES='C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const root=process.cwd(), tmp=path.join(root,'.campusfix-build');
const skill='C:/Users/HP/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(skill+'/container_tools/artifact_tool_utils.mjs'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={bg:'#F3EBDD',ink:'#302D27',muted:'#72695C',line:'#A69781',cream:'#FFFBF3',tan:'#DFCCAF',olive:'#69715A'};
let s;
function shape(x,y,w,h,geo='rect',fill=C.cream){return s.shapes.add({geometry:geo,position:{left:x,top:y,width:w,height:h},fill,line:{fill:C.line,width:1.6}});}
function text(t,x,y,w,h,size=25,bold=false,color=C.ink,align='left'){let q=shape(x,y,w,h,'textbox','none');q.line={fill:'none',width:0};q.text=t;q.text.style={typeface:'Arial',fontSize:size,bold,color,alignment:align,verticalAlignment:'middle',autoFit:'none',insets:{left:0,right:0,top:0,bottom:0}};return q;}
function box(t,x,y,w,h,geo='rect',fill=C.cream,size=24){let q=shape(x,y,w,h,geo,fill);q.text=t;q.text.style={typeface:'Arial',fontSize:size,color:C.ink,alignment:'center',verticalAlignment:'middle',insets:{left:10,right:10,top:5,bottom:5}};return q;}
function line(x1,y1,x2,y2,dash=false){return s.shapes.add({geometry:'line',position:{left:Math.min(x1,x2),top:Math.min(y1,y2),width:Math.abs(x2-x1)||0.01,height:Math.abs(y2-y1)||0.01,verticalFlip:y2<y1},fill:'none',line:{fill:C.line,width:1.7,style:dash?'dashed':'solid'}});}
function link(a,b,from='right',to='left',arrow=true,kind='straight'){return s.shapes.connect(a,b,{kind,fromSide:from,toSide:to,line:{fill:C.muted,width:1.8},tail:{type:arrow?'triangle':'none',width:'sm',length:'sm'}});}
function arrow(x1,y1,x2,y2){let a=shape(x1,y1,0.1,0.1,'rect','none'),b=shape(x2,y2,.1,.1,'rect','none');a.line=b.line={fill:'none',width:0};return link(a,b);}
function base(title,n,sub=''){s=p.slides.add();s.background.fill=C.bg;text(title,65,45,1470,64,44,true);if(sub)text(sub,65,116,1450,42,24,false,C.muted);text('CampusFix',65,849,400,22,18,false,C.muted);text(String(n).padStart(2,'0'),1465,845,70,28,20,false,C.muted,'right');return s;}
function note(t){s.speakerNotes.textFrame.setText(t);}
function caption(t){text(t,65,786,1470,46,23,false,C.muted);}
// 1 — Cover
base('SOFTWARE ENGINEERING PROJECT',1);s.shapes.items;
text('CampusFix',65,230,1450,150,112,true);
text('Smart Campus Complaint &\nMaintenance System',72,398,1380,125,48);
text('Presented by',75,650,700,34,24,false,C.muted);
text('Keha Chopra     Suhani     Palavi     Ishita',75,704,1430,50,32);
note('CampusFix is a proposed web or app-based system for campus maintenance. Students report issues, the admin prioritizes and assigns work, maintenance staff update progress, and students confirm the outcome and provide feedback. Team names reproduce the supplied spelling.');
// 2 — overview and use case
base('Project overview & use cases',2,'A shared complaint record connects students, the admin and maintenance staff.');
text('The problem',65,207,390,40,29,true);text('Broken fans, Wi-Fi faults, leaks and damaged equipment need a clear reporting and follow-up process.',65,264,385,151,28);
text('The proposed solution',65,454,390,40,29,true);text('Students submit a category, location and photo. The admin sets priority and assigns staff. Students track progress and rate the result.',65,507,390,193,28);
shape(595,194,870,551,'rect','none');text('CampusFix system',620,208,780,32,24,true);
const stu=box('«actor»\nStudent',475,329,105,90,'rect',C.tan,21),adm=box('«actor»\nAdmin',1480,356,105,90,'rect',C.tan,21),staff=box('«actor»\nStaff',1480,605,105,90,'rect',C.tan,21);
let u1=box('Register / log in',670,266,290,64,'ellipse'),u2=box('Raise complaint',650,363,300,64,'ellipse'),u3=box('Track status / alerts',650,460,300,64,'ellipse'),u4=box('Give feedback',650,557,300,64,'ellipse');
let u5=box('Set priority / assign staff',1055,318,355,70,'ellipse'),u6=box('View reports',1100,420,300,64,'ellipse'),u7=box('View assigned work',1055,565,355,64,'ellipse'),u8=box('Update status',1100,662,300,64,'ellipse');
for(let u of [u1,u2,u3,u4])link(stu,u,'right','left',false);for(let u of [u5,u6])link(adm,u,'left','right',false);for(let u of [u7,u8])link(staff,u,'left','right',false);
text('All roles log in. Students can self-register.',638,698,440,29,19,false,C.muted);
caption('Admin reports cover complaint volume, category, pending work, resolution time and student ratings.');
note('Use case diagram: rectangles marked actor are UML actor notation and ellipses represent user goals within the system boundary. Student registration is public. Admin and staff accounts are provisioned by the institution. Authentication applies to all protected use cases. Photos support diagnosis. Priority is Low, Medium or High, with admin review. Reports help identify recurring faults and monitor unresolved work.');
// 3 — class
base('Class diagram',3,'Eight core classes define accounts, complaints, work allocation and feedback.');
function cls(name,fields,methods,x,y,w=300,h=160){let q=shape(x,y,w,h);text(name,x+12,y+6,w-24,32,26,true,'#302D27','center');line(x,y+45,x+w,y+45);text(fields,x+14,y+53,w-28,h-100,21);line(x,y+h-43,x+w,y+h-43);text(methods,x+14,y+h-39,w-28,33,20);return q;}
let user=cls('User','userId, name, email\npasswordHash, role','login(), logout()',575,186,350,161);
let student=cls('Student','studentId, department','submitComplaint()',65,410,300,150),admin=cls('Admin','adminId','assignStaff()',65,186,300,150),stf=cls('Staff','staffId, specialization','updateStatus()',1165,186,350,161);
link(admin,user,'right','left');link(stf,user,'left','right');
arrow(215,410,215,374);arrow(215,374,750,374);arrow(750,374,750,347);
let comp=cls('Complaint','id, category, location, photo\npriority, status, createdAt','create(), changeStatus()',575,410,390,164);
let ass=cls('Assignment','assignmentId, assignedAt\ncomplaintId, staffId, adminId','assign(), reassign()',1165,410,350,164);
let feed=cls('Feedback','feedbackId, rating, comment','submit()',575,651,390,133);
let notif=cls('Notification','notificationId, message, readAt','send(), markRead()',65,651,395,133);
link(student,comp,'right','left',false);text('1 submits 0..*',376,450,195,29,21);
link(comp,ass,'right','left',false);text('1 has 0..*',986,450,165,28,21);
link(stf,ass,'bottom','top',false);text('1 receives 0..*',1350,362,230,30,20);
link(comp,feed,'bottom','top',false);text('1 has 0..1',782,597,190,29,21);
link(student,notif,'bottom','top',false);text('User receives 0..*',73,603,340,29,20);
text('Other associations\nEach feedback: 1 Student\nEach assignment: 1 Admin',1110,656,430,118,22);
caption('Arrows toward User indicate inheritance. Assignments retain history, with one active staff allocation per complaint.');
note('Student, Admin and Staff inherit User. Generalization uses arrows towards User. Each Complaint has one Student, zero or more historical Assignments and at most one Feedback. Each Assignment refers to one Staff and one assigning Admin. Each Feedback belongs to the submitting Student. Notification links to a recipient User, illustrated through the Student subclass here. Other associations are stated to preserve readability.');
// 4 — activity and sequence
base('Complaint lifecycle & system interactions',4,'Activity diagram on the left. Submission and assignment sequence on the right.');
text('Activity diagram',65,182,550,36,28,true);text('Sequence diagram',715,182,810,36,28,true);
const steps=['Student submits details','System validates & records','Admin sets priority / assigns','Staff starts repair','Staff marks resolved','Repair accepted?'];
let last=box('',295,231,20,20,'ellipse',C.ink);
steps.forEach((v,i)=>{let b=box(v,100,270+i*71,410,i===5?65:50,i===5?'diamond':'roundRect',i===2?C.tan:C.cream,23);link(last,b,'bottom','top');last=b;});
let done=box('Rate & close',198,729,214,42,'roundRect',C.tan,22);link(last,done,'bottom','top');
text('No: reopen',519,662,165,35,20,false,C.muted);arrow(510,658,564,658);arrow(564,658,564,508);arrow(564,508,510,508);text('Yes',321,694,100,27,19);
let xs=[750,920,1100,1280,1490];let names=['Student','Frontend','Backend','Database','Admin / Staff'];
xs.forEach((x,i)=>{box(names[i],x-70,240,140,58,'rect',C.tan,20);line(x,298,x,740,true);});
let msgs=[[0,1,'1  Submit complaint',342],[1,2,'2  Validate request',392],[2,3,'3  Save complaint',442],[2,0,'4  Return ID + status',492],[4,2,'5  Admin assigns staff',542],[2,3,'6  Save assignment',592],[2,4,'7  Notify staff',642],[4,2,'8  Staff updates status',692]];
msgs.forEach(([a,b,t,y])=>{arrow(xs[a],y,xs[b],y);text(t,Math.min(xs[a],xs[b])+8,y-30,Math.abs(xs[a]-xs[b])-12,26,18,false,C.ink);});
caption('Each status change updates the complaint history and triggers a notification for the relevant user.');
note('Lifecycle: after authentication the student submits a category, precise location, description and optional photo. Validation failures return to the form. A valid complaint begins as Submitted. The admin reviews urgency and assigns an appropriate staff member, producing Assigned status. Staff mark In Progress and then Resolved with completion notes. The student confirms the repair and rates it, producing Closed. If the issue remains, the student reopens it and the admin can reassign work. The sequence focuses on the submission and assignment scenario; database acknowledgements are omitted for readability. Admin and Staff share a diagram lifeline to show the management interface, but retain separate permissions.');
// 5 — context
base('DFD Level 0: system context',5,'CampusFix exchanges information with three external actors.');
let sys=box('0\nCampusFix\nComplaint & Maintenance System',597,332,440,240,'ellipse',C.tan,31);
let ds=box('Student',65,367,250,130,'rect',C.cream,30),da=box('Admin',1220,204,295,126,'rect',C.cream,30),dt=box('Maintenance Staff',1220,597,295,126,'rect',C.cream,28);
arrow(315,394,597,394);text('Registration, complaint,\ntracking request, feedback',327,304,290,73,22);
arrow(597,470,315,470);text('Login result, complaint ID,\nstatus, notifications',330,490,283,75,22);
arrow(1220,278,963,350);text('Credentials, priority,\nassignment, report request',860,208,355,74,21);
arrow(1010,410,1220,330);text('Login result, complaint list,\nreports, notifications',1080,379,430,76,21);
arrow(1220,623,1010,529);text('Credentials, work request,\nstatus updates',1110,481,420,63,21);
arrow(960,567,1220,694);text('Login result, assigned jobs,\nnotifications',948,711,420,68,21);
caption('The context diagram shows the system boundary. Internal processes and data stores appear at Level 1.');
note('DFD notation: rectangles are external entities, the large process is CampusFix, and directed arrows represent named data flows. A complaint includes category, location, description and photo reference. Admin requests include priority and assignment decisions plus report filters. Staff return repair progress and completion details. Authentication results, notifications and role-specific views flow back to each actor. This is a logical context diagram, not a deployment diagram.');
// 6 — DFD1 readable rows, external entities repeated deliberately
base('DFD Level 1: internal data flow',6,'Five processes manage the information behind each complaint.');
text('EXTERNAL ENTITY',65,188,300,29,19,true,C.muted);text('PROCESS',555,188,350,29,19,true,C.muted);text('DATA STORE',1180,188,350,29,19,true,C.muted);
let rows=[['Student / Admin / Staff','1.0 User Management','D1  Users','Credentials / profile','Login result','Account record'],['Student / Admin','2.0 Complaint Management','D2  Complaints','Details / priority','Complaint ID / list','Complaint record'],['Admin / Staff','3.0 Staff Assignment','D3  Assignments','Assignment / work request','Assigned jobs','Allocation record'],['Student / Staff / Admin','4.0 Status Tracking','D2  Complaints','Update / tracking request','Status / alerts / reports','Status history'],['Student','5.0 Feedback','D4  Feedback','Rating / comment','Acknowledgement','Feedback record']];
rows.forEach((r,i)=>{let y=249+i*101;let a=box(r[0],65,y,280,68,'rect',C.cream,22),b=box(r[1],620,y,360,68,'roundRect',C.tan,23),d=box(r[2],1230,y,295,68,'rect',C.cream,23);line(1250,y,1250,y+68);arrow(345,y+17,620,y+17);text(r[3],353,y-16,264,28,18);arrow(620,y+55,345,y+55);text(r[4],350,y+59,269,29,18);arrow(980,y+19,1230,y+19);arrow(1230,y+55,980,y+55);text(r[5],993,y-15,230,29,18);text('Read / write',1005,y+61,215,24,17,false,C.muted);});
text('Shared data: 3.0 reads D1 staff profiles and D2 complaints. 4.0 reads D3 assignments and D4 ratings for reports.',65,772,1470,55,21,false,C.muted);
note('This Level 1 DFD decomposes the context process into five processes. External actors and D2 are repeated to avoid intersecting arrows; each repeated label denotes the same entity or store. User Management authenticates all roles and manages student registration. Complaint Management records submissions, priority and complaint queries. Staff Assignment reads staff details in D1 and complaint records in D2, writes D3, and returns assignments. Status Tracking reads D3 to authorize staff updates, reads and writes status history in D2, delivers notifications and produces admin reports, including ratings read from D4. Feedback checks resolution and ownership against D2 and D1 before saving D4. Read/write arrows represent stored records and queries, not workflow ordering. Reports are derived outputs within 4.0 rather than an additional process.');
// 7 — architecture
base('System architecture & expected outcome',7,'A proposed three-tier design separates the interface, business rules and stored data.');
let front=box('Frontend\nWeb / mobile interface',65,252,375,154,'rect',C.cream,31),back=box('Backend\nAPI & business services',615,252,375,154,'rect',C.tan,31),db=box('Database\nPersistent records',1165,252,370,154,'can',C.cream,31);
link(front,back);link(back,db);text('HTTPS requests\nand responses',448,190,160,78,21,false,C.muted,'center');text('Queries and\nupdates',1000,190,153,78,21,false,C.muted,'center');
text('Student complaint form\nAdmin assignment dashboard\nStaff work queue\nStatus timeline and feedback',65,441,390,154,26);
text('Role-based access\nValidation and priority rules\nAssignment and status logic\nNotifications and reporting',615,441,415,154,26);
text('Users and complaints\nAssignments and history\nFeedback and notifications\nPhoto file references',1165,441,375,154,26);
text('Photo uploads use file storage. The database keeps each file reference.',65,630,1440,42,23,false,C.muted);
text('Expected outcome',65,712,425,43,30,true,C.olive);text('A traceable maintenance process with clear ownership, visible progress and feedback after repair.',485,704,1010,74,28);
note('This architecture is a proposal, independent of a particular technology stack. The frontend serves role-specific screens. The backend verifies identity and permissions on every request, validates complaint details, enforces valid status transitions and records assignment history. The database stores structured records. Photos live in file or object storage, with references in the database. Backend notification delivery and automatic frontend refresh support live status tracking. Passwords are stored as hashes. Admin reports can summarize complaint counts, categories, pending work, time to resolution and ratings. Expected benefits are design goals, not measured project results.');
await (await PresentationFile.exportPptx(p)).save(path.join(tmp,'candidate.pptx'));
for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(path.join(tmp,`slide-${i+1}.png`),new Uint8Array(await b.arrayBuffer()));}
await finalizePresentation({workspaceDir:root,candidatePath:path.join(tmp,'candidate.pptx'),finalPath:path.join(root,'output','CampusFix_Presentation.pptx'),explicitTotalSlideCount:7,pythonExecutable:'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation-final.json')});
console.log('DONE');


