import { relations } from "drizzle-orm/relations";
import { users, collaborators, workspaces, usersInAuth, customers, products, prices, subscriptions, folders, files } from "./schema";

export const collaboratorsRelations = relations(collaborators, ({one}) => ({
	user: one(users, {
		fields: [collaborators.user_id],
		references: [users.id]
	}),
	workspace: one(workspaces, {
		fields: [collaborators.workspace_id],
		references: [workspaces.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	collaborators: many(collaborators),
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
	workspaces_workspace_owner_id: many(workspaces, {
		relationName: "workspaces_workspace_owner_id_users_id"
	}),
	workspaces_workspace_owner_id: many(workspaces, {
		relationName: "workspaces_workspace_owner_id_users_id"
	}),
	subscriptions: many(subscriptions),
}));

export const workspacesRelations = relations(workspaces, ({one, many}) => ({
	collaborators: many(collaborators),
	user_workspace_owner_id: one(users, {
		fields: [workspaces.workspace_owner_id],
		references: [users.id],
		relationName: "workspaces_workspace_owner_id_users_id"
	}),
	user_workspace_owner_id: one(users, {
		fields: [workspaces.workspace_owner_id],
		references: [users.id],
		relationName: "workspaces_workspace_owner_id_users_id"
	}),
	folders: many(folders),
	files: many(files),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	users: many(users),
	customers: many(customers),
	subscriptions: many(subscriptions),
}));

export const customersRelations = relations(customers, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [customers.id],
		references: [usersInAuth.id]
	}),
}));

export const pricesRelations = relations(prices, ({one, many}) => ({
	product: one(products, {
		fields: [prices.product_id],
		references: [products.id]
	}),
	subscriptions_price_id: many(subscriptions, {
		relationName: "subscriptions_price_id_prices_id"
	}),
	subscriptions_price_id: many(subscriptions, {
		relationName: "subscriptions_price_id_prices_id"
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	prices: many(prices),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	price_price_id: one(prices, {
		fields: [subscriptions.price_id],
		references: [prices.id],
		relationName: "subscriptions_price_id_prices_id"
	}),
	price_price_id: one(prices, {
		fields: [subscriptions.price_id],
		references: [prices.id],
		relationName: "subscriptions_price_id_prices_id"
	}),
	usersInAuth: one(usersInAuth, {
		fields: [subscriptions.user_id],
		references: [usersInAuth.id]
	}),
	user: one(users, {
		fields: [subscriptions.user_id],
		references: [users.id]
	}),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	workspace: one(workspaces, {
		fields: [folders.workspace_id],
		references: [workspaces.id]
	}),
	files: many(files),
}));

export const filesRelations = relations(files, ({one}) => ({
	folder: one(folders, {
		fields: [files.folder_id],
		references: [folders.id]
	}),
	workspace: one(workspaces, {
		fields: [files.workspace_id],
		references: [workspaces.id]
	}),
}));