import { AminoMsg } from "@cosmjs/amino";
import { AminoHeight, omitDefault } from "../../../amino.helpers";
import { MsgGrant, MsgExecResponse, MsgExec, MsgRevoke, MsgGrantResponse, MsgRevokeResponse, Msg, Rpc } from "./tx";

/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Grant } from "../../../cosmos/authz/v1beta1/authz";
import { Any } from "../../../google/protobuf/any";
export const encoded = {
  grant(value: MsgGrant) {
    return {
      type_url: "/cosmos.authz.v1beta1.MsgGrant",
      value: MsgGrant.encode(value).finish()
    };
  },

  exec(value: MsgExec) {
    return {
      type_url: "/cosmos.authz.v1beta1.MsgExec",
      value: MsgExec.encode(value).finish()
    };
  },

  revoke(value: MsgRevoke) {
    return {
      type_url: "/cosmos.authz.v1beta1.MsgRevoke",
      value: MsgRevoke.encode(value).finish()
    };
  }

};