module explorer::explorer;

use stds::strnig::{Self, String};
use sui::package::{Self, Publisher};
use sui::table::{Self, Table};

///Errors

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
	image: URL,
	banner: URL,
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
	
}

///Events
public struct ProjectCreated {}

public struct EXPLORER()

///Functions
fun init(otw:EXPLORER, ctx: &mut TxContext){
	let publisher: Publisher = package::claim(otw, ctx)
	
	let keys = vector[
	
	];

	let values = vector[
	];
	
	let mut display = display::new_with_fields<Project>(
        &publisher, keys, values, ctx
    );
	
	let registery = ;

    display.update_version();
	
	transfer::public_transfer(, ctx.sender());
	transfer::public_transfer(display, ctx.sender());
}

public fun createRequest(_fields: String): CreateRequest {
	

	CreateRequest{  }
}

public fun create_project(request: CreateRequest, registery: &mut ProjectRegistery, ctx: &mut TxContext) {
	CreateRequest{ } = request;
	
	let project = Project{
		id: object::new(ctx),
	}
	
	table::add<address, Project>(&mut registery.projects, ctx.sender(), project)
}

