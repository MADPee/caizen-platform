/**
 * CaiZen - useShoppingList Hook
 * State management för inköpslistor
 */

import { useState, useCallback, useEffect } from "react";
import { shoppingListService } from "../services/shoppingListService";
import type {
  ShoppingList,
  ShoppingListItemStatus,
  Product,
  PriceEntry,
} from "../../types";

interface UseShoppingListState {
  lists: ShoppingList[];
  activeList: ShoppingList | null;
  isLoading: boolean;
  notification: { message: string; type: "success" | "error" } | null;
}

export function useShoppingList() {
  const [state, setState] = useState<UseShoppingListState>({
    lists: [],
    activeList: null,
    isLoading: true,
    notification: null,
  });

  const clearNotification = useCallback(() => {
    setState((prev) => ({ ...prev, notification: null }));
  }, []);

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setState((prev) => ({ ...prev, notification: { message, type } }));
      setTimeout(clearNotification, 3000);
    },
    [clearNotification],
  );

  const loadLists = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const lists = await shoppingListService.getLists();
    const active = await shoppingListService.getActiveList();
    setState((prev) => ({
      ...prev,
      lists,
      activeList: active,
      isLoading: false,
    }));
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const addToList = useCallback(
    async (
      product: Product,
      selectedPrice: PriceEntry,
      quantity: number = 1,
      notes?: string,
    ) => {
      let activeList = state.activeList;
      if (!activeList) {
        activeList = await shoppingListService.createList("Min inköpslista");
      }

      const updatedList = await shoppingListService.addItem(
        activeList.id,
        product,
        selectedPrice,
        quantity,
        notes,
      );

      if (updatedList) {
        setState((prev) => ({
          ...prev,
          activeList: updatedList,
          lists: prev.lists.map((l) =>
            l.id === updatedList.id ? updatedList : l,
          ),
        }));
        showNotification(`${product.name} tillagd i inköpslistan`);
      }

      return updatedList;
    },
    [state.activeList, showNotification],
  );

  const updateItemStatus = useCallback(
    async (itemId: string, status: ShoppingListItemStatus) => {
      if (!state.activeList) return;

      const updatedList = await shoppingListService.updateItemStatus(
        state.activeList.id,
        itemId,
        status,
      );

      if (updatedList) {
        setState((prev) => ({
          ...prev,
          activeList: updatedList,
          lists: prev.lists.map((l) =>
            l.id === updatedList.id ? updatedList : l,
          ),
        }));
      }
    },
    [state.activeList],
  );

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!state.activeList) return;

      const updatedList = await shoppingListService.updateItemQuantity(
        state.activeList.id,
        itemId,
        quantity,
      );

      if (updatedList) {
        setState((prev) => ({
          ...prev,
          activeList: updatedList,
          lists: prev.lists.map((l) =>
            l.id === updatedList.id ? updatedList : l,
          ),
        }));
      }
    },
    [state.activeList],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!state.activeList) return;

      const updatedList = await shoppingListService.removeItem(
        state.activeList.id,
        itemId,
      );

      if (updatedList) {
        setState((prev) => ({
          ...prev,
          activeList: updatedList,
          lists: prev.lists.map((l) =>
            l.id === updatedList.id ? updatedList : l,
          ),
        }));
        showNotification("Produkt borttagen");
      }
    },
    [state.activeList, showNotification],
  );

  const createList = useCallback(
    async (name: string) => {
      const newList = await shoppingListService.createList(name);
      setState((prev) => ({
        ...prev,
        lists: [newList, ...prev.lists],
        activeList: newList,
      }));
      showNotification(`Inköpslista "${name}" skapad`);
      return newList;
    },
    [showNotification],
  );

  const setActiveList = useCallback(
    (listId: string) => {
      const list = state.lists.find((l) => l.id === listId);
      if (list) {
        setState((prev) => ({ ...prev, activeList: list }));
      }
    },
    [state.lists],
  );

  const itemCount =
    state.activeList?.items.filter((i) => i.status === "pending").length ?? 0;

  return {
    ...state,
    itemCount,
    addToList,
    updateItemStatus,
    updateItemQuantity,
    removeItem,
    createList,
    setActiveList,
    clearNotification,
  };
}
