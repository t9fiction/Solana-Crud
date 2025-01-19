#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

// Program constants
const ANCHOR_DISCRIMINATOR_SPACE: usize = 8;
const SPACE_TITLE: usize = 4 + 50;
const SPACE_MESSAGE: usize = 4 + 280;

#[program]
pub mod crud {
    use super::*;

    pub fn create_journal_entry(ctx: Context<CreateJournalEntry>, title: String, message: String) -> Result<()>{
      let journal_entry = &mut ctx.accounts.journal_entry;
      journal_entry.owner = ctx.accounts.owner.key();
      journal_entry.title = title;
      journal_entry.message = message;
      Ok(())
    }

    pub fn update_journal_entry(ctx: Context<UpdateJournalEntry>, _title: String, message: String) -> Result<()>{
      let journal_entry = &mut ctx.accounts.journal_entry;
      journal_entry.message = message;
      Ok(())
    }

    pub fn delete_journal_entry(_ctx: Context<DeleteJournalEntry>, _title: String) -> Result<()>{
      Ok(())
    }

}

// Creating the Entry
#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct CreateJournalEntry<'info>{
  #[account(mut)]
  pub owner: Signer<'info>,

  #[account(
    init,
    payer= owner,
    space= ANCHOR_DISCRIMINATOR_SPACE + JournalEntryState::INIT_SPACE,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    constraint = title.len() <= 50 @ CrudError::TitleTooLong,
    constraint = message.len() <= 280 @ CrudError::MessageTooLong,
    constraint = title.len() > 0 @ CrudError::TitleTooShort,
    constraint = message.len() > 0 @ CrudError::MessageTooShort,
  )]
  pub journal_entry: Account<'info, JournalEntryState>,

  pub system_program: Program<'info, System>,
}

// Updating the Entry
#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct UpdateJournalEntry<'info>{
  #[account(mut)]
  pub owner: Signer<'info>,

  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    realloc = ANCHOR_DISCRIMINATOR_SPACE + JournalEntryState::INIT_SPACE,
    realloc::payer = owner,
    realloc::zero = true,
    constraint = title.len() <= 50 @ CrudError::TitleTooLong,
    constraint = message.len() <= 280 @ CrudError::MessageTooLong,
    constraint = title.len() > 0 @ CrudError::TitleTooShort,
    constraint = message.len() > 0 @ CrudError::MessageTooShort,
  )]
  pub journal_entry: Account<'info, JournalEntryState>,

  pub system_program: Program<'info, System>,

}

// Deleting the Entry
#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteJournalEntry<'info>{
  #[account(mut)]
  pub owner: Signer<'info>,

  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    close = owner,
  )]
  pub journal_entry: Account<'info, JournalEntryState>,

  pub system_program: Program<'info, System>,
}


// Journal Entry State
#[account]
#[derive(InitSpace)]
pub struct JournalEntryState{
  pub owner: Pubkey,
  #[max_len(SPACE_TITLE)]
  pub title: String,
  #[max_len(SPACE_MESSAGE)]
  pub message: String,
}


// Error Codes
#[error_code]
pub enum CrudError {
  #[msg("The provided title should be 50 characters long maximum.")]
  TitleTooLong,
  #[msg("The provided message should be 280 characters long maximum.")]
  MessageTooLong,
  #[msg("The provided title should be 1 character long minimum.")]
  TitleTooShort,
  #[msg("The provided message should be 1 character long minimum.")]
  MessageTooShort,
}