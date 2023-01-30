# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Mutation](#mutation)
  * [Objects](#objects)
    * [SendTransactionResult](#sendtransactionresult)
    * [authchain_migrations_view](#authchain_migrations_view)
    * [authchain_view](#authchain_view)
    * [block](#block)
    * [block_transaction](#block_transaction)
    * [input](#input)
    * [node](#node)
    * [node_block](#node_block)
    * [node_block_history](#node_block_history)
    * [node_transaction](#node_transaction)
    * [node_transaction_history](#node_transaction_history)
    * [output](#output)
    * [subscription_root](#subscription_root)
    * [transaction](#transaction)
  * [Inputs](#inputs)
    * [Boolean_comparison_exp](#boolean_comparison_exp)
    * [Int_comparison_exp](#int_comparison_exp)
    * [SendTransactionRequest](#sendtransactionrequest)
    * [String_comparison_exp](#string_comparison_exp)
    * [authchain_migrations_view_aggregate_order_by](#authchain_migrations_view_aggregate_order_by)
    * [authchain_migrations_view_avg_order_by](#authchain_migrations_view_avg_order_by)
    * [authchain_migrations_view_bool_exp](#authchain_migrations_view_bool_exp)
    * [authchain_migrations_view_max_order_by](#authchain_migrations_view_max_order_by)
    * [authchain_migrations_view_min_order_by](#authchain_migrations_view_min_order_by)
    * [authchain_migrations_view_order_by](#authchain_migrations_view_order_by)
    * [authchain_migrations_view_stddev_order_by](#authchain_migrations_view_stddev_order_by)
    * [authchain_migrations_view_stddev_pop_order_by](#authchain_migrations_view_stddev_pop_order_by)
    * [authchain_migrations_view_stddev_samp_order_by](#authchain_migrations_view_stddev_samp_order_by)
    * [authchain_migrations_view_stream_cursor_input](#authchain_migrations_view_stream_cursor_input)
    * [authchain_migrations_view_stream_cursor_value_input](#authchain_migrations_view_stream_cursor_value_input)
    * [authchain_migrations_view_sum_order_by](#authchain_migrations_view_sum_order_by)
    * [authchain_migrations_view_var_pop_order_by](#authchain_migrations_view_var_pop_order_by)
    * [authchain_migrations_view_var_samp_order_by](#authchain_migrations_view_var_samp_order_by)
    * [authchain_migrations_view_variance_order_by](#authchain_migrations_view_variance_order_by)
    * [authchain_view_aggregate_order_by](#authchain_view_aggregate_order_by)
    * [authchain_view_avg_order_by](#authchain_view_avg_order_by)
    * [authchain_view_bool_exp](#authchain_view_bool_exp)
    * [authchain_view_max_order_by](#authchain_view_max_order_by)
    * [authchain_view_min_order_by](#authchain_view_min_order_by)
    * [authchain_view_order_by](#authchain_view_order_by)
    * [authchain_view_stddev_order_by](#authchain_view_stddev_order_by)
    * [authchain_view_stddev_pop_order_by](#authchain_view_stddev_pop_order_by)
    * [authchain_view_stddev_samp_order_by](#authchain_view_stddev_samp_order_by)
    * [authchain_view_stream_cursor_input](#authchain_view_stream_cursor_input)
    * [authchain_view_stream_cursor_value_input](#authchain_view_stream_cursor_value_input)
    * [authchain_view_sum_order_by](#authchain_view_sum_order_by)
    * [authchain_view_var_pop_order_by](#authchain_view_var_pop_order_by)
    * [authchain_view_var_samp_order_by](#authchain_view_var_samp_order_by)
    * [authchain_view_variance_order_by](#authchain_view_variance_order_by)
    * [bigint_comparison_exp](#bigint_comparison_exp)
    * [block_bool_exp](#block_bool_exp)
    * [block_order_by](#block_order_by)
    * [block_stream_cursor_input](#block_stream_cursor_input)
    * [block_stream_cursor_value_input](#block_stream_cursor_value_input)
    * [block_transaction_aggregate_order_by](#block_transaction_aggregate_order_by)
    * [block_transaction_avg_order_by](#block_transaction_avg_order_by)
    * [block_transaction_bool_exp](#block_transaction_bool_exp)
    * [block_transaction_max_order_by](#block_transaction_max_order_by)
    * [block_transaction_min_order_by](#block_transaction_min_order_by)
    * [block_transaction_order_by](#block_transaction_order_by)
    * [block_transaction_stddev_order_by](#block_transaction_stddev_order_by)
    * [block_transaction_stddev_pop_order_by](#block_transaction_stddev_pop_order_by)
    * [block_transaction_stddev_samp_order_by](#block_transaction_stddev_samp_order_by)
    * [block_transaction_stream_cursor_input](#block_transaction_stream_cursor_input)
    * [block_transaction_stream_cursor_value_input](#block_transaction_stream_cursor_value_input)
    * [block_transaction_sum_order_by](#block_transaction_sum_order_by)
    * [block_transaction_var_pop_order_by](#block_transaction_var_pop_order_by)
    * [block_transaction_var_samp_order_by](#block_transaction_var_samp_order_by)
    * [block_transaction_variance_order_by](#block_transaction_variance_order_by)
    * [bytea_comparison_exp](#bytea_comparison_exp)
    * [enum_nonfungible_token_capability_comparison_exp](#enum_nonfungible_token_capability_comparison_exp)
    * [input_aggregate_order_by](#input_aggregate_order_by)
    * [input_avg_order_by](#input_avg_order_by)
    * [input_bool_exp](#input_bool_exp)
    * [input_max_order_by](#input_max_order_by)
    * [input_min_order_by](#input_min_order_by)
    * [input_order_by](#input_order_by)
    * [input_stddev_order_by](#input_stddev_order_by)
    * [input_stddev_pop_order_by](#input_stddev_pop_order_by)
    * [input_stddev_samp_order_by](#input_stddev_samp_order_by)
    * [input_stream_cursor_input](#input_stream_cursor_input)
    * [input_stream_cursor_value_input](#input_stream_cursor_value_input)
    * [input_sum_order_by](#input_sum_order_by)
    * [input_var_pop_order_by](#input_var_pop_order_by)
    * [input_var_samp_order_by](#input_var_samp_order_by)
    * [input_variance_order_by](#input_variance_order_by)
    * [node_block_aggregate_order_by](#node_block_aggregate_order_by)
    * [node_block_avg_order_by](#node_block_avg_order_by)
    * [node_block_bool_exp](#node_block_bool_exp)
    * [node_block_history_bool_exp](#node_block_history_bool_exp)
    * [node_block_history_order_by](#node_block_history_order_by)
    * [node_block_history_stream_cursor_input](#node_block_history_stream_cursor_input)
    * [node_block_history_stream_cursor_value_input](#node_block_history_stream_cursor_value_input)
    * [node_block_max_order_by](#node_block_max_order_by)
    * [node_block_min_order_by](#node_block_min_order_by)
    * [node_block_order_by](#node_block_order_by)
    * [node_block_stddev_order_by](#node_block_stddev_order_by)
    * [node_block_stddev_pop_order_by](#node_block_stddev_pop_order_by)
    * [node_block_stddev_samp_order_by](#node_block_stddev_samp_order_by)
    * [node_block_stream_cursor_input](#node_block_stream_cursor_input)
    * [node_block_stream_cursor_value_input](#node_block_stream_cursor_value_input)
    * [node_block_sum_order_by](#node_block_sum_order_by)
    * [node_block_var_pop_order_by](#node_block_var_pop_order_by)
    * [node_block_var_samp_order_by](#node_block_var_samp_order_by)
    * [node_block_variance_order_by](#node_block_variance_order_by)
    * [node_bool_exp](#node_bool_exp)
    * [node_order_by](#node_order_by)
    * [node_stream_cursor_input](#node_stream_cursor_input)
    * [node_stream_cursor_value_input](#node_stream_cursor_value_input)
    * [node_transaction_aggregate_order_by](#node_transaction_aggregate_order_by)
    * [node_transaction_avg_order_by](#node_transaction_avg_order_by)
    * [node_transaction_bool_exp](#node_transaction_bool_exp)
    * [node_transaction_history_aggregate_order_by](#node_transaction_history_aggregate_order_by)
    * [node_transaction_history_avg_order_by](#node_transaction_history_avg_order_by)
    * [node_transaction_history_bool_exp](#node_transaction_history_bool_exp)
    * [node_transaction_history_max_order_by](#node_transaction_history_max_order_by)
    * [node_transaction_history_min_order_by](#node_transaction_history_min_order_by)
    * [node_transaction_history_order_by](#node_transaction_history_order_by)
    * [node_transaction_history_stddev_order_by](#node_transaction_history_stddev_order_by)
    * [node_transaction_history_stddev_pop_order_by](#node_transaction_history_stddev_pop_order_by)
    * [node_transaction_history_stddev_samp_order_by](#node_transaction_history_stddev_samp_order_by)
    * [node_transaction_history_stream_cursor_input](#node_transaction_history_stream_cursor_input)
    * [node_transaction_history_stream_cursor_value_input](#node_transaction_history_stream_cursor_value_input)
    * [node_transaction_history_sum_order_by](#node_transaction_history_sum_order_by)
    * [node_transaction_history_var_pop_order_by](#node_transaction_history_var_pop_order_by)
    * [node_transaction_history_var_samp_order_by](#node_transaction_history_var_samp_order_by)
    * [node_transaction_history_variance_order_by](#node_transaction_history_variance_order_by)
    * [node_transaction_max_order_by](#node_transaction_max_order_by)
    * [node_transaction_min_order_by](#node_transaction_min_order_by)
    * [node_transaction_order_by](#node_transaction_order_by)
    * [node_transaction_stddev_order_by](#node_transaction_stddev_order_by)
    * [node_transaction_stddev_pop_order_by](#node_transaction_stddev_pop_order_by)
    * [node_transaction_stddev_samp_order_by](#node_transaction_stddev_samp_order_by)
    * [node_transaction_stream_cursor_input](#node_transaction_stream_cursor_input)
    * [node_transaction_stream_cursor_value_input](#node_transaction_stream_cursor_value_input)
    * [node_transaction_sum_order_by](#node_transaction_sum_order_by)
    * [node_transaction_var_pop_order_by](#node_transaction_var_pop_order_by)
    * [node_transaction_var_samp_order_by](#node_transaction_var_samp_order_by)
    * [node_transaction_variance_order_by](#node_transaction_variance_order_by)
    * [output_aggregate_order_by](#output_aggregate_order_by)
    * [output_avg_order_by](#output_avg_order_by)
    * [output_bool_exp](#output_bool_exp)
    * [output_max_order_by](#output_max_order_by)
    * [output_min_order_by](#output_min_order_by)
    * [output_order_by](#output_order_by)
    * [output_stddev_order_by](#output_stddev_order_by)
    * [output_stddev_pop_order_by](#output_stddev_pop_order_by)
    * [output_stddev_samp_order_by](#output_stddev_samp_order_by)
    * [output_stream_cursor_input](#output_stream_cursor_input)
    * [output_stream_cursor_value_input](#output_stream_cursor_value_input)
    * [output_sum_order_by](#output_sum_order_by)
    * [output_var_pop_order_by](#output_var_pop_order_by)
    * [output_var_samp_order_by](#output_var_samp_order_by)
    * [output_variance_order_by](#output_variance_order_by)
    * [search_output_args](#search_output_args)
    * [search_output_prefix_args](#search_output_prefix_args)
    * [timestamp_comparison_exp](#timestamp_comparison_exp)
    * [transaction_aggregate_order_by](#transaction_aggregate_order_by)
    * [transaction_avg_order_by](#transaction_avg_order_by)
    * [transaction_bool_exp](#transaction_bool_exp)
    * [transaction_max_order_by](#transaction_max_order_by)
    * [transaction_min_order_by](#transaction_min_order_by)
    * [transaction_order_by](#transaction_order_by)
    * [transaction_stddev_order_by](#transaction_stddev_order_by)
    * [transaction_stddev_pop_order_by](#transaction_stddev_pop_order_by)
    * [transaction_stddev_samp_order_by](#transaction_stddev_samp_order_by)
    * [transaction_stream_cursor_input](#transaction_stream_cursor_input)
    * [transaction_stream_cursor_value_input](#transaction_stream_cursor_value_input)
    * [transaction_sum_order_by](#transaction_sum_order_by)
    * [transaction_var_pop_order_by](#transaction_var_pop_order_by)
    * [transaction_var_samp_order_by](#transaction_var_samp_order_by)
    * [transaction_variance_order_by](#transaction_variance_order_by)
  * [Enums](#enums)
    * [authchain_migrations_view_select_column](#authchain_migrations_view_select_column)
    * [authchain_view_select_column](#authchain_view_select_column)
    * [block_select_column](#block_select_column)
    * [block_transaction_select_column](#block_transaction_select_column)
    * [cursor_ordering](#cursor_ordering)
    * [input_select_column](#input_select_column)
    * [node_block_history_select_column](#node_block_history_select_column)
    * [node_block_select_column](#node_block_select_column)
    * [node_select_column](#node_select_column)
    * [node_transaction_history_select_column](#node_transaction_history_select_column)
    * [node_transaction_select_column](#node_transaction_select_column)
    * [order_by](#order_by)
    * [output_select_column](#output_select_column)
    * [transaction_select_column](#transaction_select_column)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Int](#int)
    * [String](#string)
    * [_text](#_text)
    * [bigint](#bigint)
    * [bytea](#bytea)
    * [enum_nonfungible_token_capability](#enum_nonfungible_token_capability)
    * [timestamp](#timestamp)

</details>

## Query (query_root)
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_migrations_view</strong></td>
<td valign="top">[<a href="#authchain_migrations_view">authchain_migrations_view</a>!]!</td>
<td>

fetch data from the table: "authchain_migrations_view"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#authchain_migrations_view_select_column">authchain_migrations_view_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#authchain_migrations_view_order_by">authchain_migrations_view_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authchain_view</strong></td>
<td valign="top">[<a href="#authchain_view">authchain_view</a>!]!</td>
<td>

fetch data from the table: "authchain_view"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#authchain_view_select_column">authchain_view_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#authchain_view_order_by">authchain_view_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_view_bool_exp">authchain_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top">[<a href="#block">block</a>!]!</td>
<td>

fetch data from the table: "block"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#block_select_column">block_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#block_order_by">block_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_by_pk</strong></td>
<td valign="top"><a href="#block">block</a></td>
<td>

fetch data from the table: "block" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

A unique, int64 identifier for this block assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_transaction</strong></td>
<td valign="top">[<a href="#block_transaction">block_transaction</a>!]!</td>
<td>

fetch data from the table: "block_transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#block_transaction_select_column">block_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#block_transaction_order_by">block_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_transaction_by_pk</strong></td>
<td valign="top"><a href="#block_transaction">block_transaction</a></td>
<td>

fetch data from the table: "block_transaction" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">block_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input</strong></td>
<td valign="top">[<a href="#input">input</a>!]!</td>
<td>

fetch data from the table: "input"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#input_select_column">input_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#input_order_by">input_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_by_pk</strong></td>
<td valign="top"><a href="#input">input</a></td>
<td>

fetch data from the table: "input" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input_index</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top">[<a href="#node">node</a>!]!</td>
<td>

fetch data from the table: "node"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_select_column">node_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_order_by">node_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block</strong></td>
<td valign="top">[<a href="#node_block">node_block</a>!]!</td>
<td>

fetch data from the table: "node_block"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_block_select_column">node_block_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_block_order_by">node_block_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_by_pk</strong></td>
<td valign="top"><a href="#node_block">node_block</a></td>
<td>

fetch data from the table: "node_block" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">block_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">node_internal_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_history</strong></td>
<td valign="top">[<a href="#node_block_history">node_block_history</a>!]!</td>
<td>

fetch data from the table: "node_block_history"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_block_history_select_column">node_block_history_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_block_history_order_by">node_block_history_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_history_bool_exp">node_block_history_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_history_by_pk</strong></td>
<td valign="top"><a href="#node_block_history">node_block_history</a></td>
<td>

fetch data from the table: "node_block_history" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of this node_block_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_by_pk</strong></td>
<td valign="top"><a href="#node">node</a></td>
<td>

fetch data from the table: "node" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

A unique, int32 identifier for this node assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction</strong></td>
<td valign="top">[<a href="#node_transaction">node_transaction</a>!]!</td>
<td>

fetch data from the table: "node_transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_transaction_select_column">node_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_transaction_order_by">node_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction_by_pk</strong></td>
<td valign="top"><a href="#node_transaction">node_transaction</a></td>
<td>

fetch data from the table: "node_transaction" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">node_internal_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction_history</strong></td>
<td valign="top">[<a href="#node_transaction_history">node_transaction_history</a>!]!</td>
<td>

fetch data from the table: "node_transaction_history"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_transaction_history_select_column">node_transaction_history_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_transaction_history_order_by">node_transaction_history_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

fetch data from the table: "output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_by_pk</strong></td>
<td valign="top"><a href="#output">output</a></td>
<td>

fetch data from the table: "output" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">output_index</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_hash</td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte, double-sha256 hash of the network-encoded transaction containing this output in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>search_output</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

execute function "search_output" which returns "output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">args</td>
<td valign="top"><a href="#search_output_args">search_output_args</a>!</td>
<td>

input parameters for function "search_output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>search_output_prefix</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

execute function "search_output_prefix" which returns "output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">args</td>
<td valign="top"><a href="#search_output_prefix_args">search_output_prefix_args</a>!</td>
<td>

input parameters for function "search_output_prefix"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top">[<a href="#transaction">transaction</a>!]!</td>
<td>

fetch data from the table: "transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#transaction_select_column">transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#transaction_order_by">transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_by_pk</strong></td>
<td valign="top"><a href="#transaction">transaction</a></td>
<td>

fetch data from the table: "transaction" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
</tbody>
</table>

## Mutation (mutation_root)
mutation root

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>send_transaction</strong></td>
<td valign="top"><a href="#sendtransactionresult">SendTransactionResult</a>!</td>
<td>

Send an encoded transaction to the requested node for broadcast to the network.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">request</td>
<td valign="top"><a href="#sendtransactionrequest">SendTransactionRequest</a>!</td>
<td></td>
</tr>
</tbody>
</table>

## Objects

### SendTransactionResult

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>transaction_hash</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transmission_error_message</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transmission_success</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validation_error_message</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validation_success</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view

A view which maps migration transactions to their index in a particular authchain.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top">[<a href="#transaction">transaction</a>!]</td>
<td>

This function powers the "transaction.authchains[n].migrations[n].transaction" computed field in migration objects. This is a workaround to improve performance over an equivalent "transaction" standard Hasura relationship. When implemented as a relationship, the Hasura-compiled SQL query requires a full scan of the authchain_migrations_view, which is extremely large and expensive to compute.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#transaction_select_column">transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#transaction_order_by">transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
</tbody>
</table>

### authchain_view

A view which contains one row per possible authhead per transaction.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authhead</strong></td>
<td valign="top"><a href="#transaction">transaction</a></td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authhead_transaction_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migrations</strong></td>
<td valign="top">[<a href="#authchain_migrations_view">authchain_migrations_view</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#authchain_migrations_view_select_column">authchain_migrations_view_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#authchain_migrations_view_order_by">authchain_migrations_view_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unspent_authhead</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
</tbody>
</table>

### block

A blockchain block.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_by</strong></td>
<td valign="top">[<a href="#node_block">node_block</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_block_select_column">node_block_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_block_order_by">node_block_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>bits</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The uint32 packed representation of the difficulty target being used for this block. To be valid, the block hash value must be less than this difficulty target.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>encoded_hex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Encode a full block using the standard P2P network format, returning the result as a hex-encoded string.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fee_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total fee in satoshis paid by all transactions in this block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>generated_value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total value in satoshis generated by this block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte, double-sha256 hash of the block header (encoded using the standard P2P network format) in big-endian byte order. This is used as a universal, unique identifier for the block. Big-endian byte order is typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>header</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Encode a block header using the standard P2P network format, returning the result as a hex-encoded string.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>height</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The height of this block: the number of blocks mined between this block and its genesis block (block 0).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_count</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total number of transaction inputs in this block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total value in satoshis of all outputs spent by transaction inputs in this block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

A unique, int64 identifier for this block assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>merkle_root</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte root hash of the double-sha256 merkle tree of transactions confirmed by this block. Note, the unusual merkle tree construction used by most chains is vulnerable to CVE-2012-2459. The final node in oddly-numbered levels is duplicated, and special care is required to ensure trees contain minimal duplicatation.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonce</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The uint32 nonce used for this block. This field allows miners to introduce entropy into the block header, changing the resulting hash during mining.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_count</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total number of transaction outputs in this block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total value in satoshis of all outputs created by transactions in this block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous_block</strong></td>
<td valign="top"><a href="#block">block</a></td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous_block_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte, double-sha256 hash of the previous block's header in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The network-encoded size of this block in bytes including transactions.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timestamp</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The uint32 current Unix timestamp claimed by the miner at the time this block was mined. By consensus, block timestamps must be within ~2 hours of the actual time, but timestamps are not guaranteed to be accurate. Timestamps of later blocks can also be earlier than their parent blocks.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_count</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total number of transactions in this block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transactions</strong></td>
<td valign="top">[<a href="#block_transaction">block_transaction</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#block_transaction_select_column">block_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#block_transaction_order_by">block_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The "version" field of this block; a 4-byte field typically represented as an int32. While originally designed to indicate a block's version, this field has been used for several other purposes. BIP34 ("Height in Coinbase") enforced a minimum version of 2, BIP66 ("Strict DER Signatures") enforced a minimum version of 3, then BIP9 repurposed most bits of the version field for network signaling. In recent years, the version field is also used for the AsicBoost mining optimization.

</td>
</tr>
</tbody>
</table>

### block_transaction

A many-to-many relationship between blocks and transactions.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block">block</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction">transaction</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### input

A transaction input.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint</strong></td>
<td valign="top"><a href="#output">output</a></td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_transaction</strong></td>
<td valign="top"><a href="#output">output</a></td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_transaction_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte, double-sha256 hash of the network-encoded transaction from which this input is spent in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>redeem_bytecode_pattern</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

If the final instruction of the unlocking bytecode is a push instruction, parse its contents as a P2SH redeem bytecode, extracting the first byte of each instruction into a bytecode pattern (excluding length bytes and pushed data). If the last instruction is not a push, return NULL. Note: this function does not confirm that the spent locking bytecode is P2SH. For correct results, only call this function for inputs which spend P2SH outputs.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction">transaction</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unlocking_bytecode</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The bytecode used to unlock a transaction output. To spend an output, unlocking bytecode must be included in a transaction input which – when evaluated in the authentication virtual machine with the locking bytecode – completes in valid state.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unlocking_bytecode_pattern</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Extract the first byte of each instruction for the unlocking bytecode of an input. The resulting pattern excludes the contents of pushed values such that similar bytecode sequences produce the same pattern.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The value in satoshis of all outpoints spent by this transaction. Set to null for coinbase transactions.

</td>
</tr>
</tbody>
</table>

### node

A trusted node which has been connected to this Chaingraph instance.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_blocks</strong></td>
<td valign="top">[<a href="#node_block">node_block</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_block_select_column">node_block_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_block_order_by">node_block_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>first_connected_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a>!</td>
<td>

The UTC timestamp at which this node was first connected to Chaingraph.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

A unique, int32 identifier for this node assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>latest_connection_began_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a>!</td>
<td>

The UTC timestamp at which this node began its most recent connection to Chaingraph.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The name configured as a stable identifier for this particular trusted node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>protocol_version</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The protocol version reported by this node during the most recent connection handshake.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unconfirmed_transaction_count</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total number of unconfirmed transactions in the mempool of this node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unconfirmed_transactions</strong></td>
<td valign="top">[<a href="#node_transaction">node_transaction</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_transaction_select_column">node_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_transaction_order_by">node_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>user_agent</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The user agent reported by this node during the most recent connection handshake.

</td>
</tr>
</tbody>
</table>

### node_block

A many-to-many relationship between nodes and blocks.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced block was accepted by the referenced node. Set to NULL if the true acceptance time is unknown (the block was accepted by this node before Chaingraph began monitoring). In the event of a blockchain reorganization, the record is deleted from node_block and saved to node_block_history.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block">block</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node">node</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_history

An archive of deleted node_blocks.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced block was accepted by the referenced node in the deleted node_block. Set to NULL if the true acceptance time was unknown (the block was accepted by this node before Chaingraph began monitoring).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block">block</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by the deleted node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of this node_block_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node">node</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>removed_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a>!</td>
<td>

The UTC timestamp at which the referenced block was removed by the referenced node.

</td>
</tr>
</tbody>
</table>

### node_transaction

A many-to-many relationship between nodes and unconfirmed transactions, A.K.A. "mempool". Transactions which are first heard in a block are never recorded as node_transactions, but skip directly to being record by a pair of node_block and block_transaction relationships.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node">node</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction">transaction</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node.

</td>
</tr>
</tbody>
</table>

### node_transaction_history

An archive of deleted node_transactions.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node">node</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>replaced_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced transaction was marked as replaced (A.K.A. double-spent) by the referenced node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction">transaction</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node in the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### output

A transaction output.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The bytecode used to encumber this transaction output. To spend the output, unlocking bytecode must be included in a transaction input which – when evaluated before this locking bytecode – completes in a valid state.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode_pattern</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Extract the first byte of each instruction for the locking bytecode of an output. The resulting pattern excludes the contents of pushed values such that similar bytecode sequences produce the same pattern.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_capability</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td>

The capability of the non-fungible token (NFT) held in this output: "none", "mutable", or "minting". This field is null if no NFT is present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_commitment</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The commitment contents of the non-fungible token (NFT) held in this output (0 to 40 bytes). This field is null if no NFT is present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spent_by</strong></td>
<td valign="top">[<a href="#input">input</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#input_select_column">input_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#input_order_by">input_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>token_category</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte token category to which the token(s) in this output belong. This field is null if no tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction">transaction</a>!</td>
<td>

An object relationship

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte, double-sha256 hash of the network-encoded transaction containing this output in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### subscription_root

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_migrations_view</strong></td>
<td valign="top">[<a href="#authchain_migrations_view">authchain_migrations_view</a>!]!</td>
<td>

fetch data from the table: "authchain_migrations_view"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#authchain_migrations_view_select_column">authchain_migrations_view_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#authchain_migrations_view_order_by">authchain_migrations_view_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authchain_migrations_view_stream</strong></td>
<td valign="top">[<a href="#authchain_migrations_view">authchain_migrations_view</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "authchain_migrations_view"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#authchain_migrations_view_stream_cursor_input">authchain_migrations_view_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authchain_view</strong></td>
<td valign="top">[<a href="#authchain_view">authchain_view</a>!]!</td>
<td>

fetch data from the table: "authchain_view"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#authchain_view_select_column">authchain_view_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#authchain_view_order_by">authchain_view_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_view_bool_exp">authchain_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authchain_view_stream</strong></td>
<td valign="top">[<a href="#authchain_view">authchain_view</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "authchain_view"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#authchain_view_stream_cursor_input">authchain_view_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_view_bool_exp">authchain_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top">[<a href="#block">block</a>!]!</td>
<td>

fetch data from the table: "block"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#block_select_column">block_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#block_order_by">block_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_by_pk</strong></td>
<td valign="top"><a href="#block">block</a></td>
<td>

fetch data from the table: "block" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

A unique, int64 identifier for this block assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_stream</strong></td>
<td valign="top">[<a href="#block">block</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "block"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#block_stream_cursor_input">block_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_transaction</strong></td>
<td valign="top">[<a href="#block_transaction">block_transaction</a>!]!</td>
<td>

fetch data from the table: "block_transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#block_transaction_select_column">block_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#block_transaction_order_by">block_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_transaction_by_pk</strong></td>
<td valign="top"><a href="#block_transaction">block_transaction</a></td>
<td>

fetch data from the table: "block_transaction" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">block_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_transaction_stream</strong></td>
<td valign="top">[<a href="#block_transaction">block_transaction</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "block_transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#block_transaction_stream_cursor_input">block_transaction_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input</strong></td>
<td valign="top">[<a href="#input">input</a>!]!</td>
<td>

fetch data from the table: "input"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#input_select_column">input_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#input_order_by">input_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_by_pk</strong></td>
<td valign="top"><a href="#input">input</a></td>
<td>

fetch data from the table: "input" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input_index</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_stream</strong></td>
<td valign="top">[<a href="#input">input</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "input"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#input_stream_cursor_input">input_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top">[<a href="#node">node</a>!]!</td>
<td>

fetch data from the table: "node"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_select_column">node_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_order_by">node_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block</strong></td>
<td valign="top">[<a href="#node_block">node_block</a>!]!</td>
<td>

fetch data from the table: "node_block"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_block_select_column">node_block_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_block_order_by">node_block_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_by_pk</strong></td>
<td valign="top"><a href="#node_block">node_block</a></td>
<td>

fetch data from the table: "node_block" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">block_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">node_internal_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_history</strong></td>
<td valign="top">[<a href="#node_block_history">node_block_history</a>!]!</td>
<td>

fetch data from the table: "node_block_history"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_block_history_select_column">node_block_history_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_block_history_order_by">node_block_history_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_history_bool_exp">node_block_history_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_history_by_pk</strong></td>
<td valign="top"><a href="#node_block_history">node_block_history</a></td>
<td>

fetch data from the table: "node_block_history" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of this node_block_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_history_stream</strong></td>
<td valign="top">[<a href="#node_block_history">node_block_history</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "node_block_history"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#node_block_history_stream_cursor_input">node_block_history_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_history_bool_exp">node_block_history_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_block_stream</strong></td>
<td valign="top">[<a href="#node_block">node_block</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "node_block"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#node_block_stream_cursor_input">node_block_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_by_pk</strong></td>
<td valign="top"><a href="#node">node</a></td>
<td>

fetch data from the table: "node" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

A unique, int32 identifier for this node assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_stream</strong></td>
<td valign="top">[<a href="#node">node</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "node"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#node_stream_cursor_input">node_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction</strong></td>
<td valign="top">[<a href="#node_transaction">node_transaction</a>!]!</td>
<td>

fetch data from the table: "node_transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_transaction_select_column">node_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_transaction_order_by">node_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction_by_pk</strong></td>
<td valign="top"><a href="#node_transaction">node_transaction</a></td>
<td>

fetch data from the table: "node_transaction" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">node_internal_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction_history</strong></td>
<td valign="top">[<a href="#node_transaction_history">node_transaction_history</a>!]!</td>
<td>

fetch data from the table: "node_transaction_history"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_transaction_history_select_column">node_transaction_history_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_transaction_history_order_by">node_transaction_history_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction_history_stream</strong></td>
<td valign="top">[<a href="#node_transaction_history">node_transaction_history</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "node_transaction_history"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#node_transaction_history_stream_cursor_input">node_transaction_history_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_transaction_stream</strong></td>
<td valign="top">[<a href="#node_transaction">node_transaction</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "node_transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#node_transaction_stream_cursor_input">node_transaction_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

fetch data from the table: "output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_by_pk</strong></td>
<td valign="top"><a href="#output">output</a></td>
<td>

fetch data from the table: "output" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">output_index</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">transaction_hash</td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte, double-sha256 hash of the network-encoded transaction containing this output in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_stream</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#output_stream_cursor_input">output_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>search_output</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

execute function "search_output" which returns "output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">args</td>
<td valign="top"><a href="#search_output_args">search_output_args</a>!</td>
<td>

input parameters for function "search_output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>search_output_prefix</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

execute function "search_output_prefix" which returns "output"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">args</td>
<td valign="top"><a href="#search_output_prefix_args">search_output_prefix_args</a>!</td>
<td>

input parameters for function "search_output_prefix"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top">[<a href="#transaction">transaction</a>!]!</td>
<td>

fetch data from the table: "transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#transaction_select_column">transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#transaction_order_by">transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_by_pk</strong></td>
<td valign="top"><a href="#transaction">transaction</a></td>
<td>

fetch data from the table: "transaction" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">internal_id</td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_stream</strong></td>
<td valign="top">[<a href="#transaction">transaction</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "transaction"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#transaction_stream_cursor_input">transaction_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
</tbody>
</table>

### transaction

A transaction.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchains</strong></td>
<td valign="top">[<a href="#authchain_view">authchain_view</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#authchain_view_select_column">authchain_view_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#authchain_view_order_by">authchain_view_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#authchain_view_bool_exp">authchain_view_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_inclusions</strong></td>
<td valign="top">[<a href="#block_transaction">block_transaction</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#block_transaction_select_column">block_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#block_transaction_order_by">block_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>data_carrier_outputs</strong></td>
<td valign="top">[<a href="#output">output</a>!]</td>
<td>

Return all of this transaction's "data carrier" outputs: outputs in which value_satoshis is 0 or locking_bytecode begins with OP_RETURN.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>encoded_hex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Encode a transaction using the standard P2P network format, returning the result as a hex-encoded string.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fee_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The fee in satoshis paid by this transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a>!</td>
<td>

The 32-byte, double-sha256 hash of this transaction (encoded using the standard P2P network format) in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>identity_output</strong></td>
<td valign="top">[<a href="#output">output</a>!]</td>
<td>

Return a transaction's identity output (0th output). Making this a computed field simplifies Hasura queries by returning the identity output as a single object rather than a filtered array of one output.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_count</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total number of inputs in this transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_outpoint_transactions</strong></td>
<td valign="top">[<a href="#input">input</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#input_select_column">input_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#input_order_by">input_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total value in satoshis of all outputs spent by inputs in this transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>inputs</strong></td>
<td valign="top">[<a href="#input">input</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#input_select_column">input_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#input_order_by">input_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>is_coinbase</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>

A boolean value indicating whether this transaction is a coinbase transaction. A coinbase transaction must be the 0th transaction in a block, it must have one input which spends from the empty outpoint_transaction_hash (0x0000...) and – after BIP34 – includes the block's height in its unlocking_bytecode (A.K.A. "coinbase" field), and it may spend the sum of the block's transaction fees and block reward to its output(s).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_validation_timeline</strong></td>
<td valign="top">[<a href="#node_transaction_history">node_transaction_history</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_transaction_history_select_column">node_transaction_history_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_transaction_history_order_by">node_transaction_history_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_validations</strong></td>
<td valign="top">[<a href="#node_transaction">node_transaction</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#node_transaction_select_column">node_transaction_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#node_transaction_order_by">node_transaction_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_count</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total number of outputs in this transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The total value in satoshis of all outputs created by this transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outputs</strong></td>
<td valign="top">[<a href="#output">output</a>!]!</td>
<td>

An array relationship

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>signing_output</strong></td>
<td valign="top">[<a href="#output">output</a>!]</td>
<td>

Return a transaction's signing output (1th output) or NULL if it does not exist. Making this a computed field simplifies Hasura queries by returning the signing output as a single object rather than a filtered array of one output.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#output_select_column">output_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#output_order_by">output_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

## Inputs

### Boolean_comparison_exp

Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_eq</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gt</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gte</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_in</strong></td>
<td valign="top">[<a href="#boolean">Boolean</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lt</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lte</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_neq</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nin</strong></td>
<td valign="top">[<a href="#boolean">Boolean</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### Int_comparison_exp

Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_eq</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gt</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gte</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_in</strong></td>
<td valign="top">[<a href="#int">Int</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lt</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lte</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_neq</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nin</strong></td>
<td valign="top">[<a href="#int">Int</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### SendTransactionRequest

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>encoded_hex</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### String_comparison_exp

Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_eq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_ilike</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given case-insensitive pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_in</strong></td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_iregex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given POSIX regular expression, case insensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_like</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_neq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nilike</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given case-insensitive pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nin</strong></td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_niregex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given POSIX regular expression, case insensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nlike</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nregex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given POSIX regular expression, case sensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nsimilar</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given SQL regular expression

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_regex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given POSIX regular expression, case sensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_similar</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given SQL regular expression

</td>
</tr>
</tbody>
</table>

### authchain_migrations_view_aggregate_order_by

order by aggregate values of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#authchain_migrations_view_avg_order_by">authchain_migrations_view_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#authchain_migrations_view_max_order_by">authchain_migrations_view_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#authchain_migrations_view_min_order_by">authchain_migrations_view_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#authchain_migrations_view_stddev_order_by">authchain_migrations_view_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#authchain_migrations_view_stddev_pop_order_by">authchain_migrations_view_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#authchain_migrations_view_stddev_samp_order_by">authchain_migrations_view_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#authchain_migrations_view_sum_order_by">authchain_migrations_view_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#authchain_migrations_view_var_pop_order_by">authchain_migrations_view_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#authchain_migrations_view_var_samp_order_by">authchain_migrations_view_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#authchain_migrations_view_variance_order_by">authchain_migrations_view_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_avg_order_by

order by avg() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_bool_exp

Boolean expression to filter rows from the table "authchain_migrations_view". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_max_order_by

order by max() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_min_order_by

order by min() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_order_by

Ordering options when selecting data from "authchain_migrations_view".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_aggregate</strong></td>
<td valign="top"><a href="#transaction_aggregate_order_by">transaction_aggregate_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_stddev_order_by

order by stddev() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_stddev_pop_order_by

order by stddev_pop() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_stddev_samp_order_by

order by stddev_samp() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_stream_cursor_input

Streaming cursor of the table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#authchain_migrations_view_stream_cursor_value_input">authchain_migrations_view_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### authchain_migrations_view_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_sum_order_by

order by sum() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_var_pop_order_by

order by var_pop() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_var_samp_order_by

order by var_samp() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_migrations_view_variance_order_by

order by variance() on columns of table "authchain_migrations_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authbase_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migration_transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_aggregate_order_by

order by aggregate values of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#authchain_view_avg_order_by">authchain_view_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#authchain_view_max_order_by">authchain_view_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#authchain_view_min_order_by">authchain_view_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#authchain_view_stddev_order_by">authchain_view_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#authchain_view_stddev_pop_order_by">authchain_view_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#authchain_view_stddev_samp_order_by">authchain_view_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#authchain_view_sum_order_by">authchain_view_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#authchain_view_var_pop_order_by">authchain_view_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#authchain_view_var_samp_order_by">authchain_view_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#authchain_view_variance_order_by">authchain_view_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_avg_order_by

order by avg() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_bool_exp

Boolean expression to filter rows from the table "authchain_view". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#authchain_view_bool_exp">authchain_view_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#authchain_view_bool_exp">authchain_view_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#authchain_view_bool_exp">authchain_view_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#int_comparison_exp">Int_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authhead</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authhead_transaction_hash</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migrations</strong></td>
<td valign="top"><a href="#authchain_migrations_view_bool_exp">authchain_migrations_view_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unspent_authhead</strong></td>
<td valign="top"><a href="#boolean_comparison_exp">Boolean_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_max_order_by

order by max() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_min_order_by

order by min() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_order_by

Ordering options when selecting data from "authchain_view".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authhead</strong></td>
<td valign="top"><a href="#transaction_order_by">transaction_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authhead_transaction_hash</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>migrations_aggregate</strong></td>
<td valign="top"><a href="#authchain_migrations_view_aggregate_order_by">authchain_migrations_view_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unspent_authhead</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_stddev_order_by

order by stddev() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_stddev_pop_order_by

order by stddev_pop() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_stddev_samp_order_by

order by stddev_samp() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_stream_cursor_input

Streaming cursor of the table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#authchain_view_stream_cursor_value_input">authchain_view_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### authchain_view_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authhead_transaction_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unspent_authhead</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_sum_order_by

order by sum() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_var_pop_order_by

order by var_pop() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_var_samp_order_by

order by var_samp() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### authchain_view_variance_order_by

order by variance() on columns of table "authchain_view"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchain_length</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### bigint_comparison_exp

Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_eq</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gt</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gte</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_in</strong></td>
<td valign="top">[<a href="#bigint">bigint</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lt</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lte</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_neq</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nin</strong></td>
<td valign="top">[<a href="#bigint">bigint</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### block_bool_exp

Boolean expression to filter rows from the table "block". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#block_bool_exp">block_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#block_bool_exp">block_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>accepted_by</strong></td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>bits</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>encoded_hex</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fee_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>generated_value_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>header</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>height</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_count</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_value_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>merkle_root</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonce</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_count</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_value_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous_block</strong></td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous_block_hash</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timestamp</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_count</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transactions</strong></td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### block_order_by

Ordering options when selecting data from "block".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_by_aggregate</strong></td>
<td valign="top"><a href="#node_block_aggregate_order_by">node_block_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>bits</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>encoded_hex</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fee_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>generated_value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>header</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>height</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>merkle_root</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonce</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous_block</strong></td>
<td valign="top"><a href="#block_order_by">block_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous_block_hash</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timestamp</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transactions_aggregate</strong></td>
<td valign="top"><a href="#block_transaction_aggregate_order_by">block_transaction_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### block_stream_cursor_input

Streaming cursor of the table "block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#block_stream_cursor_value_input">block_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### block_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>bits</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The uint32 packed representation of the difficulty target being used for this block. To be valid, the block hash value must be less than this difficulty target.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte, double-sha256 hash of the block header (encoded using the standard P2P network format) in big-endian byte order. This is used as a universal, unique identifier for the block. Big-endian byte order is typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>height</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The height of this block: the number of blocks mined between this block and its genesis block (block 0).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

A unique, int64 identifier for this block assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>merkle_root</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte root hash of the double-sha256 merkle tree of transactions confirmed by this block. Note, the unusual merkle tree construction used by most chains is vulnerable to CVE-2012-2459. The final node in oddly-numbered levels is duplicated, and special care is required to ensure trees contain minimal duplicatation.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonce</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The uint32 nonce used for this block. This field allows miners to introduce entropy into the block header, changing the resulting hash during mining.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous_block_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte, double-sha256 hash of the previous block's header in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The network-encoded size of this block in bytes including transactions.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timestamp</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The uint32 current Unix timestamp claimed by the miner at the time this block was mined. By consensus, block timestamps must be within ~2 hours of the actual time, but timestamps are not guaranteed to be accurate. Timestamps of later blocks can also be earlier than their parent blocks.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The "version" field of this block; a 4-byte field typically represented as an int32. While originally designed to indicate a block's version, this field has been used for several other purposes. BIP34 ("Height in Coinbase") enforced a minimum version of 2, BIP66 ("Strict DER Signatures") enforced a minimum version of 3, then BIP9 repurposed most bits of the version field for network signaling. In recent years, the version field is also used for the AsicBoost mining optimization.

</td>
</tr>
</tbody>
</table>

### block_transaction_aggregate_order_by

order by aggregate values of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#block_transaction_avg_order_by">block_transaction_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#block_transaction_max_order_by">block_transaction_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#block_transaction_min_order_by">block_transaction_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#block_transaction_stddev_order_by">block_transaction_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#block_transaction_stddev_pop_order_by">block_transaction_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#block_transaction_stddev_samp_order_by">block_transaction_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#block_transaction_sum_order_by">block_transaction_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#block_transaction_var_pop_order_by">block_transaction_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#block_transaction_var_samp_order_by">block_transaction_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#block_transaction_variance_order_by">block_transaction_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### block_transaction_avg_order_by

order by avg() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_bool_exp

Boolean expression to filter rows from the table "block_transaction". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#block_transaction_bool_exp">block_transaction_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#block_transaction_bool_exp">block_transaction_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### block_transaction_max_order_by

order by max() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_min_order_by

order by min() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_order_by

Ordering options when selecting data from "block_transaction".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block_order_by">block_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_order_by">transaction_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### block_transaction_stddev_order_by

order by stddev() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_stddev_pop_order_by

order by stddev_pop() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_stddev_samp_order_by

order by stddev_samp() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_stream_cursor_input

Streaming cursor of the table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#block_transaction_stream_cursor_value_input">block_transaction_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### block_transaction_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_sum_order_by

order by sum() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_var_pop_order_by

order by var_pop() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_var_samp_order_by

order by var_samp() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### block_transaction_variance_order_by

order by variance() on columns of table "block_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.

</td>
</tr>
</tbody>
</table>

### bytea_comparison_exp

Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_eq</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gt</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gte</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_in</strong></td>
<td valign="top">[<a href="#bytea">bytea</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lt</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lte</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_neq</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nin</strong></td>
<td valign="top">[<a href="#bytea">bytea</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### enum_nonfungible_token_capability_comparison_exp

Boolean expression to compare columns of type "enum_nonfungible_token_capability". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_eq</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gt</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gte</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_in</strong></td>
<td valign="top">[<a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lt</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lte</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_neq</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nin</strong></td>
<td valign="top">[<a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### input_aggregate_order_by

order by aggregate values of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#input_avg_order_by">input_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#input_max_order_by">input_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#input_min_order_by">input_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#input_stddev_order_by">input_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#input_stddev_pop_order_by">input_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#input_stddev_samp_order_by">input_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#input_sum_order_by">input_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#input_var_pop_order_by">input_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#input_var_samp_order_by">input_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#input_variance_order_by">input_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### input_avg_order_by

order by avg() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_bool_exp

Boolean expression to filter rows from the table "input". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#input_bool_exp">input_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#input_bool_exp">input_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint</strong></td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_transaction</strong></td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_transaction_hash</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>redeem_bytecode_pattern</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unlocking_bytecode</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unlocking_bytecode_pattern</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### input_max_order_by

order by max() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_min_order_by

order by min() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_order_by

Ordering options when selecting data from "input".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint</strong></td>
<td valign="top"><a href="#output_order_by">output_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_transaction</strong></td>
<td valign="top"><a href="#output_order_by">output_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_transaction_hash</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>redeem_bytecode_pattern</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_order_by">transaction_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unlocking_bytecode</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unlocking_bytecode_pattern</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### input_stddev_order_by

order by stddev() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_stddev_pop_order_by

order by stddev_pop() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_stddev_samp_order_by

order by stddev_samp() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_stream_cursor_input

Streaming cursor of the table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#input_stream_cursor_value_input">input_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### input_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_transaction_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte, double-sha256 hash of the network-encoded transaction from which this input is spent in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unlocking_bytecode</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The bytecode used to unlock a transaction output. To spend an output, unlocking bytecode must be included in a transaction input which – when evaluated in the authentication virtual machine with the locking bytecode – completes in valid state.

</td>
</tr>
</tbody>
</table>

### input_sum_order_by

order by sum() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_var_pop_order_by

order by var_pop() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_var_samp_order_by

order by var_samp() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### input_variance_order_by

order by variance() on columns of table "input"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>input_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this input in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outpoint_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sequence_number</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input's source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction which includes this input.

</td>
</tr>
</tbody>
</table>

### node_block_aggregate_order_by

order by aggregate values of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#node_block_avg_order_by">node_block_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#node_block_max_order_by">node_block_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#node_block_min_order_by">node_block_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#node_block_stddev_order_by">node_block_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#node_block_stddev_pop_order_by">node_block_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#node_block_stddev_samp_order_by">node_block_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#node_block_sum_order_by">node_block_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#node_block_var_pop_order_by">node_block_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#node_block_var_samp_order_by">node_block_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#node_block_variance_order_by">node_block_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_block_avg_order_by

order by avg() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_bool_exp

Boolean expression to filter rows from the table "node_block". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#node_block_bool_exp">node_block_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#node_block_bool_exp">node_block_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int_comparison_exp">Int_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_block_history_bool_exp

Boolean expression to filter rows from the table "node_block_history". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#node_block_history_bool_exp">node_block_history_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#node_block_history_bool_exp">node_block_history_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#node_block_history_bool_exp">node_block_history_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block_bool_exp">block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int_comparison_exp">Int_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>removed_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_block_history_order_by

Ordering options when selecting data from "node_block_history".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block_order_by">block_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_order_by">node_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>removed_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_block_history_stream_cursor_input

Streaming cursor of the table "node_block_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#node_block_history_stream_cursor_value_input">node_block_history_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### node_block_history_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced block was accepted by the referenced node in the deleted node_block. Set to NULL if the true acceptance time was unknown (the block was accepted by this node before Chaingraph began monitoring).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by the deleted node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_block_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>removed_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced block was removed by the referenced node.

</td>
</tr>
</tbody>
</table>

### node_block_max_order_by

order by max() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced block was accepted by the referenced node. Set to NULL if the true acceptance time is unknown (the block was accepted by this node before Chaingraph began monitoring). In the event of a blockchain reorganization, the record is deleted from node_block and saved to node_block_history.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_min_order_by

order by min() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced block was accepted by the referenced node. Set to NULL if the true acceptance time is unknown (the block was accepted by this node before Chaingraph began monitoring). In the event of a blockchain reorganization, the record is deleted from node_block and saved to node_block_history.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_order_by

Ordering options when selecting data from "node_block".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block_order_by">block_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_order_by">node_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_block_stddev_order_by

order by stddev() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_stddev_pop_order_by

order by stddev_pop() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_stddev_samp_order_by

order by stddev_samp() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_stream_cursor_input

Streaming cursor of the table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#node_block_stream_cursor_value_input">node_block_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### node_block_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced block was accepted by the referenced node. Set to NULL if the true acceptance time is unknown (the block was accepted by this node before Chaingraph began monitoring). In the event of a blockchain reorganization, the record is deleted from node_block and saved to node_block_history.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_sum_order_by

order by sum() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_var_pop_order_by

order by var_pop() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_var_samp_order_by

order by var_samp() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_block_variance_order_by

order by variance() on columns of table "node_block"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the block referenced by this node_block.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_block.

</td>
</tr>
</tbody>
</table>

### node_bool_exp

Boolean expression to filter rows from the table "node". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#node_bool_exp">node_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#node_bool_exp">node_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>accepted_blocks</strong></td>
<td valign="top"><a href="#node_block_bool_exp">node_block_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>first_connected_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#int_comparison_exp">Int_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>latest_connection_began_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>protocol_version</strong></td>
<td valign="top"><a href="#int_comparison_exp">Int_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unconfirmed_transaction_count</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unconfirmed_transactions</strong></td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>user_agent</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_order_by

Ordering options when selecting data from "node".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accepted_blocks_aggregate</strong></td>
<td valign="top"><a href="#node_block_aggregate_order_by">node_block_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>first_connected_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>latest_connection_began_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>protocol_version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unconfirmed_transaction_count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unconfirmed_transactions_aggregate</strong></td>
<td valign="top"><a href="#node_transaction_aggregate_order_by">node_transaction_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>user_agent</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_stream_cursor_input

Streaming cursor of the table "node"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#node_stream_cursor_value_input">node_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### node_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>first_connected_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which this node was first connected to Chaingraph.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

A unique, int32 identifier for this node assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>latest_connection_began_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which this node began its most recent connection to Chaingraph.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The name configured as a stable identifier for this particular trusted node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>protocol_version</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The protocol version reported by this node during the most recent connection handshake.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>user_agent</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The user agent reported by this node during the most recent connection handshake.

</td>
</tr>
</tbody>
</table>

### node_transaction_aggregate_order_by

order by aggregate values of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#node_transaction_avg_order_by">node_transaction_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#node_transaction_max_order_by">node_transaction_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#node_transaction_min_order_by">node_transaction_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#node_transaction_stddev_order_by">node_transaction_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#node_transaction_stddev_pop_order_by">node_transaction_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#node_transaction_stddev_samp_order_by">node_transaction_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#node_transaction_sum_order_by">node_transaction_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#node_transaction_var_pop_order_by">node_transaction_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#node_transaction_var_samp_order_by">node_transaction_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#node_transaction_variance_order_by">node_transaction_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_transaction_avg_order_by

order by avg() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_bool_exp

Boolean expression to filter rows from the table "node_transaction". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#node_transaction_bool_exp">node_transaction_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#node_transaction_bool_exp">node_transaction_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int_comparison_exp">Int_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_transaction_history_aggregate_order_by

order by aggregate values of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#node_transaction_history_avg_order_by">node_transaction_history_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#node_transaction_history_max_order_by">node_transaction_history_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#node_transaction_history_min_order_by">node_transaction_history_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#node_transaction_history_stddev_order_by">node_transaction_history_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#node_transaction_history_stddev_pop_order_by">node_transaction_history_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#node_transaction_history_stddev_samp_order_by">node_transaction_history_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#node_transaction_history_sum_order_by">node_transaction_history_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#node_transaction_history_var_pop_order_by">node_transaction_history_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#node_transaction_history_var_samp_order_by">node_transaction_history_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#node_transaction_history_variance_order_by">node_transaction_history_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_transaction_history_avg_order_by

order by avg() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_bool_exp

Boolean expression to filter rows from the table "node_transaction_history". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_bool_exp">node_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int_comparison_exp">Int_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>replaced_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_transaction_history_max_order_by

order by max() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>replaced_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced transaction was marked as replaced (A.K.A. double-spent) by the referenced node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node in the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_min_order_by

order by min() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>replaced_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced transaction was marked as replaced (A.K.A. double-spent) by the referenced node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node in the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_order_by

Ordering options when selecting data from "node_transaction_history".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_order_by">node_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>replaced_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_order_by">transaction_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_transaction_history_stddev_order_by

order by stddev() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_stddev_pop_order_by

order by stddev_pop() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_stddev_samp_order_by

order by stddev_samp() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_stream_cursor_input

Streaming cursor of the table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#node_transaction_history_stream_cursor_value_input">node_transaction_history_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### node_transaction_history_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>replaced_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced transaction was marked as replaced (A.K.A. double-spent) by the referenced node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node in the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_sum_order_by

order by sum() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_var_pop_order_by

order by var_pop() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_var_samp_order_by

order by var_samp() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_history_variance_order_by

order by variance() on columns of table "node_transaction_history"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of this node_transaction_history record.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_max_order_by

order by max() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node.

</td>
</tr>
</tbody>
</table>

### node_transaction_min_order_by

order by min() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node.

</td>
</tr>
</tbody>
</table>

### node_transaction_order_by

Ordering options when selecting data from "node_transaction".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#node_order_by">node_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_order_by">transaction_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### node_transaction_stddev_order_by

order by stddev() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_stddev_pop_order_by

order by stddev_pop() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_stddev_samp_order_by

order by stddev_samp() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_stream_cursor_input

Streaming cursor of the table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#node_transaction_stream_cursor_value_input">node_transaction_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### node_transaction_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td>

The UTC timestamp at which the referenced transaction was validated by the referenced node.

</td>
</tr>
</tbody>
</table>

### node_transaction_sum_order_by

order by sum() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_var_pop_order_by

order by var_pop() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_var_samp_order_by

order by var_samp() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### node_transaction_variance_order_by

order by variance() on columns of table "node_transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.

</td>
</tr>
</tbody>
</table>

### output_aggregate_order_by

order by aggregate values of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#output_avg_order_by">output_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#output_max_order_by">output_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#output_min_order_by">output_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#output_stddev_order_by">output_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#output_stddev_pop_order_by">output_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#output_stddev_samp_order_by">output_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#output_sum_order_by">output_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#output_var_pop_order_by">output_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#output_var_samp_order_by">output_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#output_variance_order_by">output_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### output_avg_order_by

order by avg() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_bool_exp

Boolean expression to filter rows from the table "output". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#output_bool_exp">output_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#output_bool_exp">output_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode_pattern</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_capability</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability_comparison_exp">enum_nonfungible_token_capability_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_commitment</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spent_by</strong></td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>token_category</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_hash</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### output_max_order_by

order by max() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_capability</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The capability of the non-fungible token (NFT) held in this output: "none", "mutable", or "minting". This field is null if no NFT is present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_min_order_by

order by min() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_capability</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The capability of the non-fungible token (NFT) held in this output: "none", "mutable", or "minting". This field is null if no NFT is present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_order_by

Ordering options when selecting data from "output".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode_pattern</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_capability</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_commitment</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spent_by_aggregate</strong></td>
<td valign="top"><a href="#input_aggregate_order_by">input_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>token_category</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction_order_by">transaction_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_hash</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### output_stddev_order_by

order by stddev() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_stddev_pop_order_by

order by stddev_pop() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_stddev_samp_order_by

order by stddev_samp() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_stream_cursor_input

Streaming cursor of the table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#output_stream_cursor_value_input">output_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### output_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The bytecode used to encumber this transaction output. To spend the output, unlocking bytecode must be included in a transaction input which – when evaluated before this locking bytecode – completes in a valid state.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_capability</strong></td>
<td valign="top"><a href="#enum_nonfungible_token_capability">enum_nonfungible_token_capability</a></td>
<td>

The capability of the non-fungible token (NFT) held in this output: "none", "mutable", or "minting". This field is null if no NFT is present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonfungible_token_commitment</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The commitment contents of the non-fungible token (NFT) held in this output (0 to 40 bytes). This field is null if no NFT is present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>token_category</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte token category to which the token(s) in this output belong. This field is null if no tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction_hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte, double-sha256 hash of the network-encoded transaction containing this output in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_sum_order_by

order by sum() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_var_pop_order_by

order by var_pop() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_var_samp_order_by

order by var_samp() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### output_variance_order_by

order by variance() on columns of table "output"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>fungible_token_amount</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_index</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The zero-based index of this output in the transaction.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The value of this output in satoshis.

</td>
</tr>
</tbody>
</table>

### search_output_args

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode_hex</strong></td>
<td valign="top"><a href="#_text">_text</a></td>
<td></td>
</tr>
</tbody>
</table>

### search_output_prefix_args

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>locking_bytecode_prefix_hex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### timestamp_comparison_exp

Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_eq</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gt</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_gte</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_in</strong></td>
<td valign="top">[<a href="#timestamp">timestamp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lt</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_lte</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_neq</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_nin</strong></td>
<td valign="top">[<a href="#timestamp">timestamp</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### transaction_aggregate_order_by

order by aggregate values of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>avg</strong></td>
<td valign="top"><a href="#transaction_avg_order_by">transaction_avg_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>max</strong></td>
<td valign="top"><a href="#transaction_max_order_by">transaction_max_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>min</strong></td>
<td valign="top"><a href="#transaction_min_order_by">transaction_min_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev</strong></td>
<td valign="top"><a href="#transaction_stddev_order_by">transaction_stddev_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_pop</strong></td>
<td valign="top"><a href="#transaction_stddev_pop_order_by">transaction_stddev_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stddev_samp</strong></td>
<td valign="top"><a href="#transaction_stddev_samp_order_by">transaction_stddev_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#transaction_sum_order_by">transaction_sum_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_pop</strong></td>
<td valign="top"><a href="#transaction_var_pop_order_by">transaction_var_pop_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>var_samp</strong></td>
<td valign="top"><a href="#transaction_var_samp_order_by">transaction_var_samp_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variance</strong></td>
<td valign="top"><a href="#transaction_variance_order_by">transaction_variance_order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### transaction_avg_order_by

order by avg() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_bool_exp

Boolean expression to filter rows from the table "transaction". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_and</strong></td>
<td valign="top">[<a href="#transaction_bool_exp">transaction_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_not</strong></td>
<td valign="top"><a href="#transaction_bool_exp">transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>_or</strong></td>
<td valign="top">[<a href="#transaction_bool_exp">transaction_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authchains</strong></td>
<td valign="top"><a href="#authchain_view_bool_exp">authchain_view_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_inclusions</strong></td>
<td valign="top"><a href="#block_transaction_bool_exp">block_transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>data_carrier_outputs</strong></td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>encoded_hex</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fee_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#bytea_comparison_exp">bytea_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>identity_output</strong></td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_count</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_outpoint_transactions</strong></td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_value_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>inputs</strong></td>
<td valign="top"><a href="#input_bool_exp">input_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>is_coinbase</strong></td>
<td valign="top"><a href="#boolean_comparison_exp">Boolean_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_validation_timeline</strong></td>
<td valign="top"><a href="#node_transaction_history_bool_exp">node_transaction_history_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_validations</strong></td>
<td valign="top"><a href="#node_transaction_bool_exp">node_transaction_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_count</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_value_satoshis</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outputs</strong></td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>signing_output</strong></td>
<td valign="top"><a href="#output_bool_exp">output_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#bigint_comparison_exp">bigint_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### transaction_max_order_by

order by max() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_min_order_by

order by min() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_order_by

Ordering options when selecting data from "transaction".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>authchains_aggregate</strong></td>
<td valign="top"><a href="#authchain_view_aggregate_order_by">authchain_view_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block_inclusions_aggregate</strong></td>
<td valign="top"><a href="#block_transaction_aggregate_order_by">block_transaction_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>data_carrier_outputs_aggregate</strong></td>
<td valign="top"><a href="#output_aggregate_order_by">output_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>encoded_hex</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fee_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>identity_output_aggregate</strong></td>
<td valign="top"><a href="#output_aggregate_order_by">output_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_outpoint_transactions_aggregate</strong></td>
<td valign="top"><a href="#input_aggregate_order_by">input_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>input_value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>inputs_aggregate</strong></td>
<td valign="top"><a href="#input_aggregate_order_by">input_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>is_coinbase</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_validation_timeline_aggregate</strong></td>
<td valign="top"><a href="#node_transaction_history_aggregate_order_by">node_transaction_history_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node_validations_aggregate</strong></td>
<td valign="top"><a href="#node_transaction_aggregate_order_by">node_transaction_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_count</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>output_value_satoshis</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>outputs_aggregate</strong></td>
<td valign="top"><a href="#output_aggregate_order_by">output_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>signing_output_aggregate</strong></td>
<td valign="top"><a href="#output_aggregate_order_by">output_aggregate_order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### transaction_stddev_order_by

order by stddev() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_stddev_pop_order_by

order by stddev_pop() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_stddev_samp_order_by

order by stddev_samp() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_stream_cursor_input

Streaming cursor of the table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>initial_value</strong></td>
<td valign="top"><a href="#transaction_stream_cursor_value_input">transaction_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### transaction_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>hash</strong></td>
<td valign="top"><a href="#bytea">bytea</a></td>
<td>

The 32-byte, double-sha256 hash of this transaction (encoded using the standard P2P network format) in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>is_coinbase</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

A boolean value indicating whether this transaction is a coinbase transaction. A coinbase transaction must be the 0th transaction in a block, it must have one input which spends from the empty outpoint_transaction_hash (0x0000...) and – after BIP34 – includes the block's height in its unlocking_bytecode (A.K.A. "coinbase" field), and it may spend the sum of the block's transaction fees and block reward to its output(s).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#bigint">bigint</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_sum_order_by

order by sum() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_var_pop_order_by

order by var_pop() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_var_samp_order_by

order by var_samp() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

### transaction_variance_order_by

order by variance() on columns of table "transaction"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>internal_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>locktime</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>size_bytes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The network-encoded size of this transaction in bytes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td>

The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)

</td>
</tr>
</tbody>
</table>

## Enums

### authchain_migrations_view_select_column

select columns of table "authchain_migrations_view"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>authbase_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>migration_index</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>migration_transaction_internal_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### authchain_view_select_column

select columns of table "authchain_view"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>authchain_length</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>authhead_transaction_hash</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>transaction_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>unspent_authhead</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### block_select_column

select columns of table "block"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>bits</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>hash</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>height</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>merkle_root</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>nonce</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>previous_block_hash</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>size_bytes</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>timestamp</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>version</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### block_transaction_select_column

select columns of table "block_transaction"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>block_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>transaction_index</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>transaction_internal_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### cursor_ordering

ordering argument of a cursor

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ASC</strong></td>
<td>

ascending ordering of the cursor

</td>
</tr>
<tr>
<td valign="top"><strong>DESC</strong></td>
<td>

descending ordering of the cursor

</td>
</tr>
</tbody>
</table>

### input_select_column

select columns of table "input"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>input_index</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>outpoint_index</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>outpoint_transaction_hash</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>sequence_number</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>transaction_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>unlocking_bytecode</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### node_block_history_select_column

select columns of table "node_block_history"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>accepted_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>block_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>node_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>removed_at</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### node_block_select_column

select columns of table "node_block"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>accepted_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>block_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>node_internal_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### node_select_column

select columns of table "node"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>first_connected_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>latest_connection_began_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>name</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>protocol_version</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>user_agent</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### node_transaction_history_select_column

select columns of table "node_transaction_history"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>node_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>replaced_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>transaction_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>validated_at</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### node_transaction_select_column

select columns of table "node_transaction"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>node_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>transaction_internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>validated_at</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### order_by

column ordering options

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>asc</strong></td>
<td>

in ascending order, nulls last

</td>
</tr>
<tr>
<td valign="top"><strong>asc_nulls_first</strong></td>
<td>

in ascending order, nulls first

</td>
</tr>
<tr>
<td valign="top"><strong>asc_nulls_last</strong></td>
<td>

in ascending order, nulls last

</td>
</tr>
<tr>
<td valign="top"><strong>desc</strong></td>
<td>

in descending order, nulls first

</td>
</tr>
<tr>
<td valign="top"><strong>desc_nulls_first</strong></td>
<td>

in descending order, nulls first

</td>
</tr>
<tr>
<td valign="top"><strong>desc_nulls_last</strong></td>
<td>

in descending order, nulls last

</td>
</tr>
</tbody>
</table>

### output_select_column

select columns of table "output"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>fungible_token_amount</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>locking_bytecode</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>nonfungible_token_capability</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>nonfungible_token_commitment</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>output_index</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>token_category</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>transaction_hash</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>value_satoshis</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### transaction_select_column

select columns of table "transaction"

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>hash</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>internal_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>is_coinbase</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>locktime</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>size_bytes</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>version</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

### Int

### String

### _text

### bigint

### bytea

### enum_nonfungible_token_capability

### timestamp

