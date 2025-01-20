"use client";

import { getCrudProgram, getCrudProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

interface JournalEntryArgs {
  title: string;
  message: string;
  owner: PublicKey;
}

export function useCrudProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getCrudProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getCrudProgram(provider, programId),
    [provider, programId]
  );

  const accounts = useQuery({
    queryKey: ["crud", "all", { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, JournalEntryArgs>({
    mutationKey: ["journalEntry", "create", { cluster }],
    mutationFn: async ({ title, message }) => {
      return program.methods.createJournalEntry(title, message).rpc();
    },
    onSuccess: (tx)=> {
      transactionToast(tx);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create journal entry: ${error.message}`);
    },

  });

  return {
    program,
    accounts,
    programId,
    getProgramAccount,
    createEntry,
  };
}

export function useCrudProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useCrudProgram();
  console.log(program, accounts, "From journalEntry Program")

  const accountQuery = useQuery({
    queryKey: ["crud", "fetch", { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  });

  // const decrementMutation = useMutation({
  //   mutationKey: ['journalEntry', 'decrement', { cluster, account }],
  //   mutationFn: () => program.methods.decrement().accounts({ journalEntry: account }).rpc(),
  //   onSuccess: (tx) => {
  //     transactionToast(tx)
  //     return accountQuery.refetch()
  //   },
  // })

  const updateEntry = useMutation<string, Error, JournalEntryArgs>({
    mutationKey: ["journalEntry", "update", { cluster, account }],
    mutationFn: async ({ title, message }) => {
      return program.methods.updateJournalEntry(title, message).accounts({}).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update journal entry: ${error.message}`);
    },
  });

  const deleteEntry = useMutation({
    mutationKey: ["journalEntry", "delete", { cluster }],
    mutationFn: (title: string) =>{
     return program.methods.deleteJournalEntry(title).rpc()
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      accounts.refetch();
    }
  });

  return {
    accountQuery,
    updateEntry,
    deleteEntry
  };
}