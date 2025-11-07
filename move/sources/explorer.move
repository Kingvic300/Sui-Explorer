module explorer::explorer;

use std::string::{Self, String};
use sui::package::{Self, Publisher};
use sui::url::{Self, Url};
use sui::table::{Self, Table};
use sui::display;

///Errors
const EInvalidCategory: u64 = 23;


///Constants

///Enums
public enum Category has copy, drop, store{
	DeFi,
	Gaming,
	Infrasturcture,
	NFT,
}

///Structs
public struct ProjectRegistery has key {
	id: UID,
	projects: Table<address, Project>
}

public struct Project has key, store {
	id: UID,
	name: String,
	image: Url,
	banner: Url,
	category: Category,
	description: String,
	tagline: String,
	products: Table<address, Product>,
}

public struct Product has key, store {
	id: UID,
	name: String,
	description: String,
	packages: Table<address, Package>,	
}

public struct Package has key, store {
	id: UID,
	name: String,
	description: String,
}

///Potatoes
public struct CreateRequest {
	name: String,
	image: Url,
	banner: Url,
	category: Category,
	description: String,
	tagline: String,
}

///Events
public struct ProjectCreated {}

public struct EXPLORER has drop()

///Functions
fun init(otw:EXPLORER, ctx: &mut TxContext){
	let publisher: Publisher = package::claim(otw, ctx);
	
	let keys = vector[
		b"name".to_string()
	];

	let values = vector[
		b"{name}".to_string()
	];
	
	let mut display = display::new_with_fields<Project>(
        &publisher, keys, values, ctx
    );
	
	let registery = ProjectRegistery {
		id: object::new(ctx),
		projects: table::new<address, Project>(ctx),
	};

    display.update_version();
	
	transfer::public_transfer(publisher, ctx.sender());
	transfer::share_object(registery);
	transfer::public_transfer(display, ctx.sender());
}

public fun createRequest(
		name: String,
		image: Url,
		banner: Url,
		category_num: u8,
		description: String,
		tagline: String,
	): CreateRequest {
	
	assert!(category_num < 4, EInvalidCategory);
	
	let category: Category = if(category_num == 0) { 
		Category::DeFi 
	} else if(category_num ==1) {
		Category::Gaming
	} else if(category_num ==2) {
		Category::Infrasturcture
	} else if(category_num ==3) {
		Category::NFT
	} else { Category::DeFi };

	CreateRequest { name, image, banner, category, description, tagline }
}

public fun create_project(request: CreateRequest, registery: &mut ProjectRegistery, ctx: &mut TxContext) {
	let CreateRequest { name, image, banner, category, description, tagline } = request; //input validity checks done on CreateRequest constuctor
	
	let project = Project{
		id: object::new(ctx),
		name, 
		image, 
		banner, 
		category, 
		description, 
		tagline,
		products: table::new<address, Product>(ctx),
	};
	
	table::add<address, Project>(&mut registery.projects, ctx.sender(), project);
	//emit event if needed
}

public fun add_product_to_project(project: &mut Project, product: Product, ctx: &mut TxContext){
	table::add<address, Product>(&mut project.products, ctx.sender(), product);
}


