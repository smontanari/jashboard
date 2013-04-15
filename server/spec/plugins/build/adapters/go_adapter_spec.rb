require 'spec_helper'
require 'json_spec'
require 'open-uri'
require 'stringio'
require 'plugins/build/adapters/go_adapter'

module Jashboard
  module Plugin
    module Build
      describe GoAdapter do
        before(:each) do
          adapter_class = Class.new do
            include GoAdapter
          end
          @adapter = adapter_class.new
        end
      end
    end
  end
end