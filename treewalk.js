//This script seach for the document in specific folder and its subdirectory
//then move that document to a specified location and send to specified workflow

//specify workflow
const WORKFLOWID = 29 // workflow id
//specify folder root folder to be seached 
const TREEWORKBASEFOLDER =  "Daily";
//new folder structure
const NEWFOLDERNAME = "¶Datahouse¶Finance¶TRA¶Invoices¶" + COMPANY.substring(0,1) + "¶" + COMPANY;
//kewording form used
const KEYWORDINGFORM = "invoice";

if (EM_TREE_STATE == 1) {
	EM_WRITE_CHANGED = true;
	
	log.info("----Entry found: " + EM_ACT_SORD.name + "[" + EM_ACT_SORD.id + "]");
	if (EM_ACT_SORD.type < SordC.LBT_DOCUMENT) {
		if ((EM_ACT_SORD.name.startsWith("0")) || (EM_ACT_SORD.name.startsWith(TREEWORKBASEFOLDER)) || (EM_ACT_SORD.id == 1)){
			//Do not delete base folder or archive entry. Identification on name or Id
			//Archive root entry should never be empty. so test only for safaty reason
			return;
		}
		
		//Test if folder has childs, is empty or not. Do not delete if not empty
		var info = ixConnect.ix().checkoutSord(EM_ACT_SORD.id, EditInfoC.mbSord, LockC.NO);
		var sordToDelete = info.sord;
		if (sordToDelete) {
			var childcount = sordToDelete.childCount;
			if (childcount == 0) {
				ix.deleteSord(sordToDelete.parentId, sordToDelete.id);
			}
		}
	}else{
		log.info("Object is the document: move to new filing structure and then send to workflow");	
		if (EM_ACT_SORD.maskName.equalsIgnoreCase(KEYWORDINGFORM)) {
			//Only move invoice
			if (EM_INDEX_LOADED){
				// New folder path, structure and name
				var newFolderName = NEWFOLDERNAME;
				//Move to new folder
				log.info("--->Inhalt Variable NewFolderName:" + newFolderName);
				bt.moveTo(Sord, newFolderName);
				//send to workflow to the workflow
				log.info("-->send document : " + EM_ACT_SORD.name + " to " +   "workflow id: " + WORKFLOWID);	
				wf.startWorkflow(WORKFLOWID, NAME ,EM_ACT_SORD.id);
			}
		}
	}
}
	
