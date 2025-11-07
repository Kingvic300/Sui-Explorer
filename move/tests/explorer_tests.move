#[test_only]
module explorer::explorer_tests;
use explorer::explorer;
use sui::test_scenario as ts;
use sui::table;

const ENotImplemented: u64 = 0;

const Admin: address = @0x1;

#[test]
fun test_create_project(){
	let mut scenario = ts::begin(Admin);
	
	{ 
		explorer::share_registery_for_testing(scenario.ctx());
	};
	
	scenario.next_tx(Admin);

	let mut registery = scenario.take_shared<explorer::ProjectRegistery>();
	let name = b"Test Poll".to_string();
	let image = b"https://github.com".to_string();
	let banner = b"https://github.com/Luko".to_string();
	let category_num = 0;
	let description = b"testing poll contract".to_string();
	let tagline = b"Tagline".to_string();
	
	let request = explorer::createRequest(name, image, banner, category_num, description, tagline);
	explorer::create_project(request, &mut registery, scenario.ctx());
	
	let project = table::remove(registery.projects_borrow_mut(), Admin);
	assert!(explorer::get_name(&project) == b"Test Poll".to_string(), 12);
	
	//assertions
	
	ts::return_shared(registery);
	explorer::destroy_project(project);
	scenario.end();	
}


#[test, expected_failure(abort_code = ::explorer::explorer_tests::ENotImplemented)]
fun test_explorer_fail() {
    abort ENotImplemented
}


