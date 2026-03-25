/**
 * CaiZen Shopping List Service
 * Hanterar inköpslistor med localStorage-persistens
 */

import type {
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemStatus,
  Product,
  PriceEntry,
} from "../../types";

const STORAGE_KEY = "caizen_shopping_lists";

function loadFromStorage(): ShoppingList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ShoppingList[];
    return parsed.map((list) => ({
      ...list,
      createdAt: new Date(list.createdAt),
      updatedAt: new Date(list.updatedAt),
      items: list.items.map((item) => ({
        ...item,
        addedAt: new Date(item.addedAt),
        purchasedAt: item.purchasedAt ? new Date(item.purchasedAt) : undefined,
      })),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(lists: ShoppingList[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch {
    console.error("Kunde inte spara inköpslista till localStorage");
  }
}

function recalculateList(list: ShoppingList): ShoppingList {
  const totalEstimated = list.items
    .filter((i) => i.status !== "skipped")
    .reduce((sum, i) => sum + i.totalPriceSEK, 0);
  const totalPurchased = list.items
    .filter((i) => i.status === "purchased")
    .reduce((sum, i) => sum + i.totalPriceSEK, 0);
  const purchasedCount = list.items.filter(
    (i) => i.status === "purchased",
  ).length;

  return {
    ...list,
    totalEstimatedCostSEK: totalEstimated,
    totalPurchasedCostSEK: totalPurchased,
    itemCount: list.items.length,
    purchasedCount,
    updatedAt: new Date(),
  };
}

export class ShoppingListService {
  private lists: ShoppingList[];

  constructor() {
    this.lists = loadFromStorage();
  }

  async getLists(): Promise<ShoppingList[]> {
    return this.lists;
  }

  async getList(listId: string): Promise<ShoppingList | undefined> {
    return this.lists.find((l) => l.id === listId);
  }

  async getActiveList(): Promise<ShoppingList> {
    let active = this.lists.find((l) =>
      l.items.some((i) => i.status === "pending"),
    );
    if (!active) {
      active = this.lists[0];
    }
    if (!active) {
      active = await this.createList("Min inköpslista");
    }
    return active;
  }

  async createList(
    name: string,
    vehicleId?: string,
    vehicleName?: string,
  ): Promise<ShoppingList> {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      vehicleId,
      vehicleName,
      items: [],
      totalEstimatedCostSEK: 0,
      totalPurchasedCostSEK: 0,
      itemCount: 0,
      purchasedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.lists = [newList, ...this.lists];
    saveToStorage(this.lists);
    return newList;
  }

  async addItem(
    listId: string,
    product: Product,
    selectedPrice: PriceEntry,
    quantity: number = 1,
    notes?: string,
    vehicleId?: string,
    vehicleName?: string,
  ): Promise<ShoppingList | undefined> {
    const idx = this.lists.findIndex((l) => l.id === listId);
    if (idx === -1) return undefined;

    const articleNumber =
      product.specifications["Artikelnummer"] ??
      product.specifications["Biltema Art.nr"] ??
      product.partNumber;

    const newItem: ShoppingListItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      specifications: product.specifications,
      selectedRetailerId: selectedPrice.retailerId,
      selectedRetailerName: selectedPrice.retailer.name,
      selectedPriceSEK: selectedPrice.priceSEK,
      quantity,
      unitSize: selectedPrice.unitSize,
      totalPriceSEK: selectedPrice.priceSEK * quantity,
      url: selectedPrice.url,
      articleNumber,
      status: "pending",
      notes,
      addedAt: new Date(),
      vehicleId,
      vehicleName,
    };

    const list = this.lists[idx];
    const updatedList = recalculateList({
      ...list,
      items: [...list.items, newItem],
    });

    this.lists = [
      ...this.lists.slice(0, idx),
      updatedList,
      ...this.lists.slice(idx + 1),
    ];
    saveToStorage(this.lists);
    return updatedList;
  }

  async updateItemStatus(
    listId: string,
    itemId: string,
    status: ShoppingListItemStatus,
  ): Promise<ShoppingList | undefined> {
    const idx = this.lists.findIndex((l) => l.id === listId);
    if (idx === -1) return undefined;

    const list = this.lists[idx];
    const updatedItems = list.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status,
            purchasedAt: status === "purchased" ? new Date() : item.purchasedAt,
          }
        : item,
    );

    const updatedList = recalculateList({ ...list, items: updatedItems });
    this.lists = [
      ...this.lists.slice(0, idx),
      updatedList,
      ...this.lists.slice(idx + 1),
    ];
    saveToStorage(this.lists);
    return updatedList;
  }

  async updateItemQuantity(
    listId: string,
    itemId: string,
    quantity: number,
  ): Promise<ShoppingList | undefined> {
    const idx = this.lists.findIndex((l) => l.id === listId);
    if (idx === -1) return undefined;

    const list = this.lists[idx];
    const updatedItems = list.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity,
            totalPriceSEK: item.selectedPriceSEK * quantity,
          }
        : item,
    );

    const updatedList = recalculateList({ ...list, items: updatedItems });
    this.lists = [
      ...this.lists.slice(0, idx),
      updatedList,
      ...this.lists.slice(idx + 1),
    ];
    saveToStorage(this.lists);
    return updatedList;
  }

  async removeItem(
    listId: string,
    itemId: string,
  ): Promise<ShoppingList | undefined> {
    const idx = this.lists.findIndex((l) => l.id === listId);
    if (idx === -1) return undefined;

    const list = this.lists[idx];
    const updatedList = recalculateList({
      ...list,
      items: list.items.filter((i) => i.id !== itemId),
    });

    this.lists = [
      ...this.lists.slice(0, idx),
      updatedList,
      ...this.lists.slice(idx + 1),
    ];
    saveToStorage(this.lists);
    return updatedList;
  }

  async deleteList(listId: string): Promise<void> {
    this.lists = this.lists.filter((l) => l.id !== listId);
    saveToStorage(this.lists);
  }
}

export const shoppingListService = new ShoppingListService();
export default shoppingListService;
