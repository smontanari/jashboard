require 'spec_helper'
require 'ipsum'
require 'plugins/ipsum/ipsum_plugin'

module Jashboard
  module Plugin
    describe IpsumPlugin do
      it("should register as monitor type handler for type 'ipsum'") do
        Plugin.instance_variable_get(:@adapters)["ipsum"].should_not be_nil
      end

      context("Runtime info: generating sentences") do
        before(:each) do
          class ::Fixnum
            alias_method :original_sentences, :sentences
            def sentences(language)
              "#{self} sentences in #{language.inspect}"
            end
          end
        end
        after(:each) do
          class ::Fixnum
            alias_method :sentences, :original_sentences
            remove_method :original_sentences
          end
        end

        it("should return sentences in french") do
          monitor_configuration = Struct.new(:no_sentences, :language).new(10, "french")
          subject.get_runtime_info(monitor_configuration).should == {text: "10 sentences in :french"}
        end
        it("should return sentences in english") do
          monitor_configuration = Struct.new(:no_sentences, :language).new(5, "english")
          subject.get_runtime_info(monitor_configuration).should == {text: "5 sentences in :english"}
        end
      end
    end
  end
end
