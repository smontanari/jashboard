require 'spec_helper'
require 'ipsum'
require 'plugins/ipsum/ipsum_plugin'

module Jashboard
  module Plugin
    describe IpsumMonitorPlugin do
      it("should register as monitor type handler for type 'ipsum'") do
        MonitorAdapter.class_variable_get('@@type_handlers')['ipsum'].should == IpsumMonitorPlugin
      end

      it("should return the configuration from the type handler") do
        input_configuration = {'no_sentences' => 10, 'language' => "english"}

        configuration = subject.get_configuration(input_configuration)
        configuration.no_sentences.should == 10
        configuration.language.should == "english"
      end
      context("generating sentences") do
        before(:each) do
          class ::Fixnum
            alias_method :original_sentences, :sentences
            def sentences(language)
              "#{self} sentences in #{language.to_s}"
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
          monitor_configuration = {no_sentences: 10, language: "french"}
          subject.get_runtime_info(monitor_configuration).should === "10 sentences in french"
        end
        it("should return sentences in english") do
          monitor_configuration = {no_sentences: 5, language: "english"}
          subject.get_runtime_info(monitor_configuration).should === "5 sentences in english"
        end
      end
    end
  end
end
